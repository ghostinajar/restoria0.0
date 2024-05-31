import Character from '../model/classes/Character.js'

async function character(parsedCommand, user) {
    let myCharacterNames, requestedCharacterName, foundCharacter, response;
    if (parsedCommand.directObject) {
        requestedCharacterName = parsedCommand.directObject.toString().toLowerCase();
        //get a list of user's characters' names
        myCharacterNames = await Character.find({'_id': { $in: user.characters }}, 'name') 
          .then(characters => {
            const names = characters.map(character => character.name);
            return names;
          })
          .catch(err => {
            console.error(err);
        });
        console.log(myCharacterNames)

        // is user requesting a character they own?
        if (myCharacterNames.includes(requestedCharacterName)) {
            //get the character
            foundCharacter = await Character.findOne({ name: requestedCharacterName});
            if (foundCharacter) {
                response = {
                    emitToUser : `found ${foundCharacter.displayName} in myCharacterNames! 
                    Switching to character ${character.displayName}...`,
                    broadcastToRoom : `${user.displayName} becomes translucent and unresponsive.`
                }
            } else {
                response = {
                    emitToUser : `Couldn't retrieve the character from db.`
                } 
            }
        } else {
            response = {
                emitToUser : `You don't own a character named "${parsedCommand.directObject}".`
            }
        }
    } else {
        response = {
            emitToUser : `Which character?`
        }
    };
    return response;
}

export default character;