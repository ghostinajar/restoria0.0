// activateMobNodes
import worldEmitter from "../model/classes/WorldEmitter.js";
import logger from "../logger.js";
import activateItemNodes from "./activateItemNodes.js";
async function activateMobNodes(mobNodes, mobArray) {
    for (const mobNode of mobNodes) {
        try {
            const zone = await new Promise((resolve) => {
                worldEmitter.once(`zone${mobNode.fromZoneId.toString()}Loaded`, resolve);
                worldEmitter.emit(`zoneRequested`, mobNode.fromZoneId.toString());
            });
            if (!zone) {
                logger.error(`activateMobNodes couldn't get a zone`);
                return null;
            }
            const blueprint = await zone.mobBlueprints.find((blueprint) => blueprint._id.toString() === mobNode.loadsMobBlueprintId.toString());
            if (!blueprint) {
                logger.error(`activateMobNodes couldn't find blueprint ${mobNode.loadsMobBlueprintId} in zone ${zone.name}.`);
                return null;
            }
            const mob = await new Promise((resolve) => {
                worldEmitter.once(`mobManagerAddedMobFromBlueprint${blueprint._id}`, resolve);
                worldEmitter.emit(`roomRequestingNewMob`, blueprint);
            });
            //TODO initiate mob inventory
            mob.inventory = [];
            await activateItemNodes(blueprint.itemNodes, mob.inventory);
            //logger.debug(`Items in mob "${mob.name}": ${mob.inventory.map(item => item.name)}`)
            await mobArray.push(mob);
        }
        catch (err) {
            logger.error(`Error in activateMobNodes with a mobNode: ${err.message}`);
            throw err;
        }
    }
}
export default activateMobNodes;
