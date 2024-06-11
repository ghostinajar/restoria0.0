// who.js

import logger from "../logger.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import makeMessage from "../types/makeMessage.js";

async function who(user) {
    logger.debug(`Who command initiated`)
    const whoArray = await new Promise((resolve) => {
        worldEmitter.once('userManagerReturningWhoArray', resolve);
        worldEmitter.emit('requestingWhoArray');
    });
    if (!whoArray) {
        logger.error(`Error in who command.`);
        return;
    }

    let message = makeMessage(false, 'who', JSON.stringify(whoArray));

    worldEmitter.emit(`messageFor${user.username}`, message)
};

export default who;