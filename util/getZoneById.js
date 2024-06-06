import worldEmitter from "../model/classes/WorldEmitter.js";

async function getZoneById(id) {
    try {const zone = await new Promise((resolve) => {
            worldEmitter.once('zoneLoaded', resolve);
            worldEmitter.emit('zoneRequested', id);
        });
        if (!zone) {
            logger.error(`ActivateItemNodes couldn't find Zone ${itemNode.fromZoneId}`);
            return null;
        }
        return zone;
    } catch(err) {
        logger.error(`Error in getZoneById: ${err.message}`);
    }
}

export default getZoneById;