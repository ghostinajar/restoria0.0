// activateItemNodes
import worldEmitter from "../model/classes/WorldEmitter.js";
import logger from "../logger.js";
import createItemFromBlueprint from "./createItemFromBlueprint.js";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
async function activateItemNodes(itemNodes, inventory, isNested = false) {
    try {
        for (const itemNode of itemNodes) {
            try {
                // get the zone where the blueprint is stored
                const zone = await new Promise((resolve) => {
                    worldEmitter.once(`zone${itemNode.fromZoneId.toString()}Loaded`, resolve);
                    worldEmitter.emit(`zoneRequested`, itemNode.fromZoneId.toString());
                });
                if (!zone) {
                    logger.error(`activateItemNodes couldn't get a zone`);
                    return null;
                }
                // get the blueprint
                const blueprint = zone.itemBlueprints.find((blueprint) => blueprint._id.toString() === itemNode.loadsBlueprintId.toString());
                if (!blueprint) {
                    logger.error(`ActivateItemNodes couldn't find blueprint ${itemNode.loadsBlueprintId} in zone ${zone.name}.`);
                    return null;
                }
                const item = await createItemFromBlueprint(blueprint);
                // If item is a container and we're not in a nested inventory,
                // initiate its inventory recursively
                if (item.tags.container && !isNested) {
                    if (!item.inventory) {
                        item.inventory = [];
                    }
                    if (blueprint.itemNodes) {
                        await activateItemNodes(blueprint.itemNodes, item.inventory, true);
                        // logger.debug(
                        //   `Items in container "${item.name}": ${item.inventory.map(
                        //     (item: IItem) => {
                        //       return item.name;
                        //     }
                        //   )}`
                        // );
                    }
                }
                else if (item.itemType == "container" && isNested) {
                    logger.error(`Skipping container "${item.name}" because it is nested.`);
                    continue;
                }
                inventory.push(item);
            }
            catch (err) {
                logger.error(`Error in ActivateItemNodes with an itemNode: ${err.message}`);
                throw err;
            }
        }
    }
    catch (error) {
        catchErrorHandlerForFunction("activateItemNodes", error);
    }
}
export default activateItemNodes;
