import logger from "../logger.js";

async function author(user) {
    user.activeCharacter = null;
    user.characterState = false;
    await user.save();
    return {
        style: `author`,
        emitToUser: `Your character's consciousness returns to its author, ${user.displayName}.`,
        broadcastToRoom: `A character's consciousness returns to its author.`
    }
}

export default author;