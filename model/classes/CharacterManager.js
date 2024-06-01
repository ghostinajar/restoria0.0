import logger from '../../logger.js';
import Character from './Character.js';
import worldEmitter from './WorldEmitter.js';

class CharacterManager {
    constructor() {
        this.characters = new Map();  // Stores all characters with their _id.toString() as key

        const characterLoggingInHandler = async (characterName) => {
            try {
                //logger.info(`worldEmitter received 'characterLogginIn' and ${characterName}, checking...`)
                const character = await this.addCharacterByName(characterName);
                //logger.info(`worldEmitter sending 'characterManagerAddedCharacter' and ${character.displayName}...`)
                worldEmitter.emit('characterManagerAddedCharacter', character);
            } catch(err) {
                logger.error(`error in characterLogginInHandler: ${err.message}`);
                throw err
            }
        }

        worldEmitter.on('characterLoggingIn', characterLoggingInHandler);
    };

    async addCharacterById(id) {
        try {
            const character = await Character.findById(id);
            if (character) {
                //check for duplicate character, then add to characters
                if (!this.characters.has(character._id.toString())) {
                    this.characters.set(character._id.toString(), character);
                    logger.info(`characterManager added ${character.name} to characters.`);
                } else {
                    logger.warn(`Character with id ${id} already exists in characters.`);
                }
                logger.info(`Active characters: ${JSON.stringify(Array.from(this.characters.values()).map(character => character.name))}`);
                return character;
            } else {
                logger.error(`characterManager couldn't find character with id ${id}.`);
            }
        } catch (err) {
            logger.error(`Error in addCharacterById: ${err.message}`);
            throw err;
        }
    }

    async addCharacterByName(name) {
        try {
            const character = await Character.findOne({name});
            if (character) {
                //check for duplicate character, then add to characters
                if (!this.characters.has(character._id.toString())) {
                    this.characters.set(character._id.toString(), character);
                    logger.info(`characterManager added ${character.name} to characters.`);
                } else {
                    logger.warn(`Character with name ${name} already exists in characters.`);
                }
                logger.info(`Active characters: ${JSON.stringify(Array.from(this.characters.values()).map(character => character.name))}`);
                return character;
            } else {
                logger.error(`characterManager couldn't find character with name ${name}.`);
            }
        } catch (err) {
            logger.error(`Error in addCharacterByName: ${err.message}`);
            throw err;
        }
    }
    
    // async getCharacterById(id) {
    //     try {
    //         const character = this.characters.get(id.toString());
    //         if (character) {
    //             return character;
    //         } else {
    //             logger.error(`characterManager can't find character with id: ${id}.`);
    //             return null;
    //         };
    //     } catch(err) {
    //         logger.error(`Error in getCharacterById: ${err.message}`);
    //         throw err;
    //     }
    // }

    // async removeCharacterById(id) {
    //     try {
    //         this.characters.delete(id.toString());
    //         logger.info(`Active characters: ${JSON.stringify(Array.from(this.characters.values()).map(character => character.name))}`)
    //     } catch(err) {
    //         logger.error(`Error in removeCharacterById: ${err.message}`);
    //         throw err;
    //     };
    // }

    clearContents() {
        this.characters = null
        worldEmitter.off('characterLoggingIn', characterLoggingInHandler);
    }
}

export default CharacterManager; 