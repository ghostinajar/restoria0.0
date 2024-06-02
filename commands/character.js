import logger from "../logger.js";

async function character(parsedCommand, user) {
    if (!parsedCommand.directObject) {
        return { emitToUser : `Which character?` };
    }

    const requestedCharacterName = parsedCommand.directObject.toString().toLowerCase();
    const myCharacterNames = user.characters.map(character => character.name);

    if (!myCharacterNames.includes(requestedCharacterName)) {
        return { emitToUser : `You don't own a character named "${parsedCommand.directObject}".` };
    }

    const foundCharacter = user.findCharacterByName(requestedCharacterName);

    if (!foundCharacter) {
        return { emitToUser : `Couldn't retrieve the character.` };
    }

    user.activeCharacter = foundCharacter;
    user.characterState = true;
    logger.info(`User "${user.name}" made ${user.activeCharacter.name} their active character.`)

    return {
        emitToUser : `Switching to character ${foundCharacter.displayName}...`,
        broadcastToRoom : `${user.displayName} becomes silent and still.`
    };
}

export default character;