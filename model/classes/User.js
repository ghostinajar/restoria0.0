import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import logger from '../../logger.js';
import locationSchema from './Location.js';
import descriptionSchema from './Description.js';
import Character from './Character.js';
import isValidName from '../../isValidName.js';

const { Schema, model } = mongoose;

// the user (aka "Author") lacks most of the data/methods of a character, 
// but is playable, and stores the user's auth info
const userSchema = new Schema({
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // as a salted hash
    salt: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    isTeacher: { type: Boolean, default: false },
    location: {
        type: locationSchema,
        default: {inZone: '664f8ca70cc5ae9b173969a8'}
    },
    pronouns: Number, // 0 = it/it, 1 = he/him, 2 = she/her, 3 = they/them
    creationDate: {
        type: Date,
        default: Date.now
    },
    lastLoginDate: Date,
    hoursPlayed: { type: Number, default: 0 },
    description: {
        type: descriptionSchema,
        default: () => ({})
    },
    characters: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Character'
        }
    ],
    students: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (err) {
        throw err;
    }
};

userSchema.methods.createCharacter = async function(characterData) {
    try {
        if (!isValidName(characterData.name)) {
            logger.error(`${characterData.name} is not a valid name. Returning null.`)
            return null
        }
        //set character's author as reference its creator's User._id
        characterData.author = this._id;
        //create the character
        const character = new Character(characterData)
        character.save();
        logger.info(`User "${this.name}" created character "${character.name}".`)
        return character;
    } catch (err) {
        logger.error(`Error in userSchema.createCharacter: ${err.message} `)
        throw err;
    }
};

const User = model('User', userSchema);
export default User;