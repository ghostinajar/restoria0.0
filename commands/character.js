// character.js

import logger from "../logger.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import makeMessage from "../types/makeMessage.js";

const userOwnsCharacter = (name, user) => {
    const requestedCharacterName = name.toString().toLowerCase();
    const myCharacterNames = user.characters.map(character => character.name);
    if (myCharacterNames.includes(requestedCharacterName)) {
        return true;
    }
    return false;
}

async function character(parsedCommand, user) {
    //logger.debug(`Character command function initiated with ${user.displayName}`);
    let message = makeMessage(false, 'character', ``);

    
    if (!parsedCommand.directObject) {
        message.content = `What character?`;
        worldEmitter.emit(`messageFor${user.name}`, message);
        return;
    }
    //logger.debug(`Character command continuing with directObject ${parsedCommand.directObject}`);


    if (!userOwnsCharacter(parsedCommand.directObject, user)) {
        message.content = `You don't own a character named ${parsedCommand.directObject}.`;
        worldEmitter.emit(`messageFor${user.name}`, message);
        return;
    }
    //logger.debug(`Character command continuing, user owns character ${parsedCommand.directObject}`);


    const foundCharacter = user.findCharacterByName(parsedCommand.directObject.toString().toLowerCase());
    if (!foundCharacter) {
        message.content = `Couldn't find a character named ${parsedCommand.directObject}.`
        worldEmitter.emit(`messageFor${user.name}`, message);
        return;
    }
    //logger.debug(`Character command continuing, found character ${foundCharacter.displayName}`);

    message.content = `You focus your consciousness on the character, ${foundCharacter.displayName}...`;
    worldEmitter.emit(`messageFor${user.name}`, message);

    message.content = `${user.displayName} becomes silent and still.`
    worldEmitter.emit(`messageFor${user.name}sRoom`, message);
    user.activeCharacter = foundCharacter;
    user.characterState = true;
    logger.info(`User "${user.name}" made ${user.activeCharacter.name} their active character.`)
}

export default character;