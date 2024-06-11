import worldEmitter from "../model/classes/WorldEmitter.js";
import logger from "../logger.js";

async function getZoneById(id : string) {
    try {const zone = await new Promise((resolve) => {
            worldEmitter.once('zoneLoaded', resolve);
            worldEmitter.emit('zoneRequested', id);
        });
        if (!zone) {
            logger.log(`error`, `getZoneByid couldn't find Zone`);
            return null;
        }
        return zone;
    } catch(err : any) {
        logger.log(`error`, `Error in getZoneById: ${err.message}`);
    }
}

export default getZoneById;