import worldEmitter from "../model/classes/WorldEmitter.js";
import logger from "../logger.js";

async function destroyInventory(inventory) {
    for (const item of inventory) {
        try {
            //logger.debug(`Destroying item "${item.name}"`)
            await new Promise((resolve) => {
                worldEmitter.once('itemManagerRemovedItem', resolve);
                worldEmitter.emit('inventoryDestroyingItem', item._id.toString());
            });
            // If item is a container and we're not in a nested inventory, initiate its inventory recursively
            if (item.itemType == 'container') {
                await destroyInventory(item.inventory);
                //logger.debug(`Container "${item.name}" inventory: ${item.inventory.map(item => {return item.name})}`);
            } 
        } catch(err) {
            logger.error(`Error in destroyInventory: ${err.message}`);
            throw(err);
        }
    }
    inventory = [];
};

export default destroyInventory;