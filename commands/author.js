import logger from "../logger.js";
import worldEmitter from '../model/classes/WorldEmitter.js';

async function author(user) {
    user.activeCharacter = null;
    user.characterState = false;

    await user.save();
    let message = {
        userGen: false,
        type: `author`,
        content: `Your character's consciousness returns to its author, ${user.displayName}.`,
    }
    worldEmitter.emit(`messageFor${user.name}`, message);

    message.content = `${user.displayName}'s consciousness returns.`
    worldEmitter.emit(`messageFor${user.name}sRoom`, message);
}

export default author;