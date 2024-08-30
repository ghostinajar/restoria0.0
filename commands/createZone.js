// createZone
import makeMessage from "../types/makeMessage.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import logger from "../logger.js";
import COMPLETION_STATUS from "../constants/COMPLETION_STATUS.js";
import truncateDescription from "../util/truncateDescription.js";
import exits from "./exits.js";
import Zone from "../model/classes/Zone.js";
import Name from "../model/classes/Name.js";
import mongoose from "mongoose";
import ROOM_TYPE from "../constants/ROOM_TYPE.js";
async function createZone(zoneFormData, author) {
    try {
        let message = makeMessage("rejection", ``);
        // logger.debug(`Trying to create zone ${zoneFormData.name}`);
        if (author.unpublishedZoneTally > 4) {
            message.content = `Sorry, you can't have more then 5 unpublished zones at a time.`;
            worldEmitter.emit(`messageFor${author.username}`, message);
            return null;
        }
        // Check for duplicate name
        let nameIsTaken = await Name.findOne({
            name: zoneFormData.name,
        });
        if (nameIsTaken) {
            message.content = `That name is taken.`;
            worldEmitter.emit(`messageFor${author.username}`, message);
            return null;
        }
        truncateDescription(zoneFormData.description, author);
        const newZoneId = new mongoose.Types.ObjectId();
        let newZoneData = {
            _id: newZoneId,
            author: author._id,
            name: zoneFormData.name,
            history: {
                creationDate: new Date(),
                modifiedDate: new Date(),
                completionStatus: COMPLETION_STATUS.DRAFT,
            },
            description: zoneFormData.description,
            rooms: [
                {
                    _id: new mongoose.Types.ObjectId(),
                    author: author._id,
                    fromZoneId: newZoneId,
                    roomType: ROOM_TYPE.NONE,
                    name: `An Empty Room`,
                    history: {
                        creationDate: new Date(),
                        modifiedDate: new Date(),
                        completionStatus: COMPLETION_STATUS.DRAFT,
                    },
                    playerCap: 30,
                    mobCap: 30,
                    isDark: false,
                    isIndoors: false,
                    isOnWater: false,
                    isUnderwater: false,
                    noMounts: false,
                    noMobs: false,
                    noMagic: false,
                    noCombat: false,
                    itemsForSale: [],
                    mountIdForSale: [],
                    mapCoords: [0, 0, 0],
                    description: {
                        examine: `Every new zone starts with one empty room. Type EDIT ROOM to bring it to life, or CREATE ROOM to add`,
                    },
                    exits: {},
                    mobNodes: [],
                    itemNodes: [],
                },
            ],
            mobBlueprints: [],
            itemBlueprints: [],
            suggestions: [],
            minutesToRepop: zoneFormData.minutesToRepop,
        };
        // create and save to db
        const newZone = new Zone(newZoneData);
        if (!newZone) {
            logger.error(`createZone couldn't save new zone ${newZoneData.name}!`);
            message.content = `Sorry, we ran into a problem saving your zone!`;
            worldEmitter.emit(`messageFor${author.username}`, message);
            return null;
        }
        if (author && author._id) {
            newZoneData.author = author._id;
        }
        await newZone.save();
        logger.info(`Author "${author.name}" created zone "${newZoneData.name}".`);
        const nameToRegister = new Name({ name: newZoneData.name });
        const nameSaved = await nameToRegister.save();
        if (!nameSaved) {
            logger.error(`createZone couldn't save the name ${newZoneData.name} to Names!`);
            return null;
        }
        // TODO add to user's zone tally
        if (!author.unpublishedZoneTally) {
            author.unpublishedZoneTally = 0;
        }
        author.unpublishedZoneTally++;
        // notify user
        message.type = "success";
        message.content = `You created a zone: ${newZoneData.name}!`;
        worldEmitter.emit(`messageFor${author.username}`, message);
        await exits(author);
        return newZoneData;
    }
    catch (error) {
        logger.error(`Error in createZone: ${error.message} `);
        throw error;
    }
}
export default createZone;
