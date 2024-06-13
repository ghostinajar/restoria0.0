// activateMobNodes
import worldEmitter from "../model/classes/WorldEmitter.js";
import logger from "../logger.js";
import activateItemNodes from "./activateItemNodes.js";
import { IMobNode } from "../model/classes/MobNode.js";
import { IMob } from "../model/classes/Mob.js";
import { IMobBlueprint } from "../model/classes/MobBlueprint.js";
import { IZone } from "../model/classes/Zone.js";

async function activateMobNodes(
  mobNodes: Array<IMobNode>,
  mobArray: Array<IMob>
) {
  for (const mobNode of mobNodes) {
    try {
      const zone: IZone = await new Promise((resolve) => {
        worldEmitter.once(`zoneLoaded`, resolve);
        worldEmitter.emit(`zoneRequested`, mobNode.fromZoneId.toString());
      });
      if (!zone) {
        logger.error(`activateMobNodes couldn't get a zone`);
        return null;
      }

      const blueprint = await zone.mobBlueprints.find(
        (blueprint: IMobBlueprint) =>
          blueprint._id.toString() === mobNode.loadsMobBlueprintId.toString()
      );
      if (!blueprint) {
        logger.error(
          `activateMobNodes couldn't find blueprint ${mobNode.loadsMobBlueprintId} in zone ${zone.name}.`
        );
        return null;
      }

      for (let i = 0; i < mobNode.quantity; i++) {
        const mob: IMob = await new Promise((resolve) => {
          worldEmitter.once("mobManagerAddedMob", resolve);
          worldEmitter.emit("roomRequestingNewMob", blueprint);
        });
        //TODO initiate mob inventory
        mob.inventory = [];
        await activateItemNodes(blueprint.itemNodes, mob.inventory);
        //logger.debug(`Items in mob "${mob.name}": ${mob.inventory.map(item => item.name)}`)
        await mobArray.push(mob);
      }
    } catch (err: any) {
      logger.error(`Error in activateMobNodes with a mobNode: ${err.message}`);
      throw err;
    }
  }
}

export default activateMobNodes;
