import worldEmitter from "../model/classes/WorldEmitter.js";
import logger from "../logger.js";
import destroyInventory from "./destroyInventory.js";

async function destroyMobs(mobArray) {
    for (const mob of mobArray) {
        try {
            // Destroy mob inventory
            await destroyInventory(mob.inventory);
            mob.inventory = [];
            //logger.debug(`Mob "${mob.name}" inventory: ${mob.inventory.map(item => item.name)}`)

            //logger.debug(`Destroying mob "${mob.name}"`)
            await new Promise((resolve) => {
                worldEmitter.once('mobManagerRemovedMob', resolve);
                worldEmitter.emit('roomDestroyingMob', mob._id.toString());
            });
        } catch(err) {
            logger.error(`Error in destroyMobs: ${err.message}`);
            throw(err);
        }
    }
};

export default destroyMobs;