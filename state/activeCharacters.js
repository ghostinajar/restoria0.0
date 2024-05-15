//map of active character instances playing the game
let activeCharacters = new Map();

function addCharacter(characterId, characterData, parentId) {
    characterData.parentId = parentId;
    activeCharacters.set(characterId, characterData);
  }
  
  function moveCharacter(characterId, newParentId) {
    let characterData = activeCharacters.get(characterId);
    if (characterData) {
        characterData.parentId = newParentId;
    }
  }

export default { activeCharacters, addCharacter, moveCharacter };


