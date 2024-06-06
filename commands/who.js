import logger from "../logger.js";
import worldEmitter from "../model/classes/WorldEmitter.js";

async function who() {
    logger.debug(`Who command initiated`)
    const whoArray = await new Promise((resolve) => {
        worldEmitter.once('userManagerReturningWhoArray', resolve);
        worldEmitter.emit('requestingWhoArray');
    });
    return {style: `who`, emitToUser: JSON.stringify(whoArray)} 
};

export default who;