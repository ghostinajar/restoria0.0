import worldEmitter from "../model/classes/WorldEmitter.js";
import logger from "../logger.js";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
async function destroyMobs(mobArray) {
    try {
        for (const mob of mobArray) {
            try {
                mob.inventory = [];
                //logger.debug(`Destroying mob "${mob.name}"`)
                await new Promise((resolve) => {
                    worldEmitter.once(`mobManagerRemovedMob${mob._id.toString}`, resolve);
                    worldEmitter.emit(`roomDestroyingMob`, mob._id.toString());
                });
            }
            catch (err) {
                logger.error(`Error in destroyMobs: ${err.message}`);
                throw err;
            }
        }
    }
    catch (error) {
        catchErrorHandlerForFunction("destroyMobs", error);
    }
}
export default destroyMobs;
