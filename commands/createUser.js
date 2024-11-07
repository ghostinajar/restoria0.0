// createUser
// allows user to create new users from the /register page, or from in game
import { Types } from "mongoose";
import makeMessage from "../util/makeMessage.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import logger from "../logger.js";
import User from "../model/classes/User.js";
import isValidName from "../util/isValidName.js";
import Name from "../model/classes/Name.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { historyStartingNow } from "../model/classes/History.js";
import purifyDescriptionOfObject from "../util/purify.js";
// Return user, or a message explaining failure (if by author, emit message to their socket)
async function createUser(userFormData, author) {
    try {
        let message = makeMessage("rejection", ``);
        // Validate new name
        if (!isValidName(userFormData.username)) {
            message.content = `Names must be fewer than 18 letters only.`;
            if (author) {
                worldEmitter.emit(`messageFor${author.username}`, message);
            }
            return message;
        }
        // Validate user limit per author
        if (author && author.users.length >= 12) {
            message.content = `You already have 12 users. That's the limit!`;
            worldEmitter.emit(`messageFor${author.username}`, message);
            return message;
        }
        // Check for duplicate name
        let nameIsTaken = await Name.findOne({
            name: userFormData.username,
        });
        if (nameIsTaken) {
            message.content = `That name is taken.`;
            if (author) {
                worldEmitter.emit(`messageFor${author.username}`, message);
            }
            return message;
        }
        // Validate password
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
        if (!passwordRegex.test(userFormData.password)) {
            message.content =
                "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number.";
            if (author) {
                worldEmitter.emit(`messageFor${author.username}`, message);
            }
            return message;
        }
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userFormData.password, salt);
        let newUserData = {
            _id: new mongoose.Types.ObjectId(),
            username: userFormData.username.toLowerCase(),
            name: userFormData.name,
            password: hashedPassword,
            salt: salt,
            isAdmin: false,
            isTeacher: false,
            author: author?._id || null,
            location: {
                inZone: new Types.ObjectId(process.env.WORLD_RECALL_ZONEID),
                inRoom: new Types.ObjectId(process.env.WORLD_RECALL_ROOMID),
            },
            pronouns: userFormData.pronouns,
            history: historyStartingNow(),
            hoursPlayed: 0,
            job: userFormData.job,
            level: 1,
            statBlock: {
                strength: 12,
                dexterity: 12,
                constitution: 12,
                intelligence: 12,
                wisdom: 12,
                charisma: 12,
                spirit: 12,
            },
            goldHeld: 0,
            goldBanked: 0,
            trainingPoints: 30,
            jobLevels: {
                cleric: 0,
                mage: 0,
                rogue: 0,
                warrior: 0,
            },
            description: {
                examine: ``,
                study: ``,
                research: ``,
            },
            users: [],
            students: [],
            //may change when training is implemented
            trained: [],
            inventory: [],
            storage: [],
            equipped: {
                arms: null,
                body: null,
                ears: null,
                feet: null,
                finger1: null,
                finger2: null,
                hands: null,
                head: null,
                held: null,
                legs: null,
                neck: null,
                shield: null,
                shoulders: null,
                waist: null,
                wrist1: null,
                wrist2: null,
                weapon1: null,
                weapon2: null,
            },
            affixes: [],
        };
        switch (newUserData.job) {
            case "cleric": {
                newUserData.statBlock.wisdom = 14;
                newUserData.jobLevels.cleric = 1;
                break;
            }
            case "mage": {
                newUserData.statBlock.intelligence = 14;
                newUserData.jobLevels.mage = 1;
                break;
            }
            case "rogue": {
                newUserData.statBlock.dexterity = 14;
                newUserData.jobLevels.rogue = 1;
                break;
            }
            case "warrior": {
                newUserData.statBlock.strength = 14;
                newUserData.jobLevels.warrior = 1;
                break;
            }
            default:
                break;
        }
        purifyDescriptionOfObject(newUserData);
        //create the user in mongoose (objectId will be assigned when user.save())
        const newUser = new User(newUserData);
        if (!newUser) {
            logger.error(`createUser couldn't save new user ${newUserData.name}!`);
            message.content = `Sorry, we ran into a problem saving your user!`;
            if (author) {
                worldEmitter.emit(`messageFor${author.username}`, message);
            }
            return message;
        }
        if (author && author._id) {
            newUserData.author = author._id;
        }
        await newUser.save();
        const nameToRegister = new Name({ name: newUser.username });
        const nameSaved = await nameToRegister.save();
        if (!nameSaved) {
            logger.error(`createZone couldn't save the name ${newUser.name} to Names!`);
            message.content = `Sorry, we ran into a problem saving your user!`;
            if (author) {
                worldEmitter.emit(`messageFor${author.username}`, message);
            }
            return message;
        }
        if (author) {
            logger.info(`Author "${author.name}" created user "${newUser.name}".`);
            message.type = "createUser";
            message.content = `You created ${newUser.name} the ${newUser.job}! You can sign out, then sign in as your new user.`;
            if (newUser.author) {
                logger.info(`Author ${author.name} is the author of ${newUser.name}.`);
            }
            worldEmitter.emit(`messageFor${author.username}`, message);
        }
        else {
            logger.info(`New user registered: "${newUser.name}".`);
        }
        return newUser;
    }
    catch (error) {
        if (author) {
            worldEmitter.emit(`messageFor${author.username}`, makeMessage("rejection", `There was an error on our server. Ralu will have a look at it soon!`));
        }
        if (error instanceof Error) {
            logger.error(`createUser error: ${error.message}`);
        }
        else {
            logger.error(`createUser error: ${error}`);
        }
        throw error;
    }
}
export default createUser;
