// createCharacter.js
import Message from "../model/classes/Message.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import logger from "../logger.js";

async function createCharacter (characterData, user) {
    try {
        logger.debug(`Trying to create character ${characterData.name}`);
        const character = await user.createCharacter(characterData);
        if (!character) {
            logger.error(`Error in createCharacter with ${characterData}.`)
        }
        const message = new Message(
            false, 
            'createCharacter', 
            `You created ${character.displayName} the ${character.job}! You have ${user.characters.length}/12 characters. Type 'character ${character.displayName}' to play your new character.`
        )
        worldEmitter.emit(`messageFor${user.name}`, message);
    } catch (err) {
        logger.error(`Error in createCharacter: ${err.message}`);
        throw err;
    }
}

export default createCharacter;
