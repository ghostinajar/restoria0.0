// activateItemNodes
import worldEmitter from "../model/classes/WorldEmitter.js";
import logger from "../logger.js";
import createItemFromBlueprint from "./createItemFromBlueprint.js";
import { IItemNode } from "../model/classes/ItemNode.js";
import { IItem } from "../model/classes/Item.js";
import { IZone } from "../model/classes/Zone.js";
import { IItemBlueprint } from "../model/classes/ItemBlueprint.js";

async function activateItemNodes(
  itemNodes: Array<IItemNode>,
  inventory: Array<IItem>,
  isNested = false
) {
  for (const itemNode of itemNodes) {
    try {
      const zone: IZone = await new Promise((resolve) => {
        worldEmitter.once(
          `zone${itemNode.fromZoneId.toString()}Loaded`,
          resolve
        );
        worldEmitter.emit(`zoneRequested`, itemNode.fromZoneId.toString());
      });
      if (!zone) {
        logger.error(`activateItemNodes couldn't get a zone`);
        return null;
      }

      const blueprint: IItemBlueprint | undefined =
        await zone.itemBlueprints.find(
          (blueprint) =>
            blueprint._id.toString() ===
            itemNode.loadsItemBlueprintId.toString()
        );
      if (!blueprint) {
        logger.error(
          `ActivateItemNodes couldn't find blueprint ${itemNode.loadsItemBlueprintId} in zone ${zone.name}.`
        );
        return null;
      }

      for (let i = 0; i < itemNode.quantity; i++) {
        const item = await createItemFromBlueprint(blueprint);
        // If item is a container and we're not in a nested inventory,
        // initiate its inventory recursively
        if (item.itemType == "container" && !isNested) {
          if (!item.inventory) {
            item.inventory = [];
          }
          await activateItemNodes(blueprint.itemNodes, item.inventory, true);
          // logger.debug(
          //   `Items in container "${item.name}": ${item.inventory.map(
          //     (item: IItem) => {
          //       return item.name;
          //     }
          //   )}`
          // );
        } else if (item.itemType == "container" && isNested) {
          logger.error(
            `Skipping container "${item.name}" because it is nested.`
          );
          continue;
        }
        inventory.push(item);
      }
    } catch (err: any) {
      logger.error(
        `Error in ActivateItemNodes with an itemNode: ${err.message}`
      );
      throw err;
    }
  }
}

export default activateItemNodes;
