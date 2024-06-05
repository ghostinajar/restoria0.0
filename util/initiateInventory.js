import worldEmitter from "../model/classes/WorldEmitter.js";
import logger from "../logger.js";

async function initiateInventory(inventory, itemNodes, isNested = false) {
    for (const itemNode of itemNodes) {
        try {
            const zone = await new Promise((resolve) => {
                worldEmitter.once('zoneLoaded', resolve);
                worldEmitter.emit('zoneRequested', itemNode.fromZoneId);
            });
            if (!zone) {
                logger.error(`initiateInventory couldn't find Zone ${itemNode.fromZoneId}`);
            }

            const blueprint = await zone.itemBlueprints.find(blueprint => blueprint._id.toString() === itemNode.loadsItemBlueprintId.toString());        
            if(!blueprint) {
                logger.error(`initiateInventory couldn't find blueprint ${itemNode.loadsItemBlueprintId} in zone ${zone.name}.`)
            }
            
            for(let i = 0; i < itemNode.quantity; i++) {
                const item = await new Promise((resolve) => {
                    worldEmitter.once('itemManagerAddedItem', resolve);
                    worldEmitter.emit('inventoryRequestingNewItem', blueprint);
                });

                // If item is a container and we're not in a nested inventory, initiate its inventory recursively
                if (item.itemType == 'container' && !isNested) {
                    await initiateInventory(item.inventory, blueprint.itemNodes, true);
                    //logger.debug(`Items in container "${item.name}": ${item.inventory.map(item => {return item.name})}`);
                } else if (item.itemType == 'container' && isNested) {
                    logger.error(`Skipping container "${item.name}" because it is nested.`);
                    continue;
                }

                inventory.push(item);
            }
        } catch(err) {
            logger.error(`Error in initiateInventory with an itemNode: ${err.message}`);
            throw(err);
        }
    }
};

export default initiateInventory;