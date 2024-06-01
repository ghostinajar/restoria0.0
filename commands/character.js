import Character from '../model/classes/Character.js'
import worldEmitter from '../model/classes/WorldEmitter.js';

async function character(parsedCommand, user) {
    if (!parsedCommand.directObject) {
        return { emitToUser : `Which character?` };
    }

    const requestedCharacterName = parsedCommand.directObject.toString().toLowerCase();

    //get a list of user's characters' names
    const myCharacterNames = await getCharacterNames(user.characters);

    if (!myCharacterNames.includes(requestedCharacterName)) {
        return { emitToUser : `You don't own a character named "${parsedCommand.directObject}".` };
    }

    // Add character to characterManager, attach to socket
    const foundCharacter = await new Promise((resolve) => {
        worldEmitter.once('characterManagerAddedCharacter', resolve);
        worldEmitter.emit('characterLoggingIn', requestedCharacterName);
      });

    if (!foundCharacter) {
        return { emitToUser : `Couldn't retrieve the character from db.` };
    }

    return {
        emitToUser : `found ${foundCharacter.displayName} in myCharacterNames! 
        Switching to character ${foundCharacter.displayName}...`,
        broadcastToRoom : `${user.displayName} becomes translucent and unresponsive.`
    };
}

async function getCharacterNames(characterIds) {
    try {
        const characters = await Character.find({'_id': { $in: characterIds }}, 'name');
        return characters.map(character => character.name);
    } catch (err) {
        console.error(err);
        return [];
    }
}

export default character;
