import worldEmitter from "../model/classes/WorldEmitter.js";
import logger from "../logger.js";
import activateItemNodes from "./activateItemNodes.js";

async function initiateMobNodes(mobArray, mobNodes) {
    for (const mobNode of mobNodes) {
        try {
            const zone = await new Promise((resolve) => {
                worldEmitter.once('zoneLoaded', resolve);
                worldEmitter.emit('zoneRequested', mobNode.fromZoneId);
            });
            if (!zone) {
                logger.error(`initiateMobNodes couldn't find Zone ${mobNode.fromZoneId}`);
            }

            const blueprint = await zone.mobBlueprints.find(blueprint => blueprint._id.toString() === mobNode.loadsMobBlueprintId.toString());        
            if(!blueprint) {
                logger.error(`initiateMobNodes couldn't find blueprint ${mobNode.loadsMobBlueprintId} in zone ${zone.name}.`)
            }
            
            for(let i = 0; i < mobNode.quantity; i++) {
                const mob = await new Promise((resolve) => {
                    worldEmitter.once('mobManagerAddedMob', resolve);
                    worldEmitter.emit('roomRequestingNewMob', blueprint);
                });
                //TODO initiate mob inventory
                mob.inventory = []
                await activateItemNodes(blueprint.itemNodes, mob.inventory);
                logger.debug(`Items in mob "${mob.name}": ${mob.inventory.map(item => item.name)}`)
                await mobArray.push(mob);
            }
        } catch(err) {
            logger.error(`Error in initiateMobNodes with a mobNode: ${err.message}`);
            throw(err);
        }
    }
};

export default initiateMobNodes;