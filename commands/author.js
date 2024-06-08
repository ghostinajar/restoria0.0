// author.js

import logger from "../logger.js";
import worldEmitter from '../model/classes/WorldEmitter.js';
import Message from "../model/classes/Message.js";

async function author(user) {
    user.activeCharacter = null;
    user.characterState = false;

    await user.save();
    let message = new Message(false, 'author', `Your character's consciousness returns to its author, ${user.displayName}.`);
    worldEmitter.emit(`messageFor${user.name}`, message);

    message.content = `${user.displayName}'s consciousness returns.`
    worldEmitter.emit(`messageFor${user.name}sRoom`, message);
}

export default author;