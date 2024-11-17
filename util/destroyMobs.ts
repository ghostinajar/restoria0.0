import worldEmitter from "../model/classes/WorldEmitter.js";
import logger from "../logger.js";
import { IMob } from "../model/classes/Mob.js";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";

async function destroyMobs(mobArray: Array<IMob>) {
  try {
    for (const mob of mobArray) {
      try {
        mob.inventory = [];

        //logger.debug(`Destroying mob "${mob.name}"`)
        await new Promise((resolve) => {
          worldEmitter.once(`mobManagerRemovedMob${mob._id.toString}`, resolve);
          worldEmitter.emit(`roomDestroyingMob`, mob._id.toString());
        });
      } catch (err: any) {
        logger.error(`Error in destroyMobs: ${err.message}`);
        throw err;
      }
    }
  } catch (error: unknown) {
    catchErrorHandlerForFunction("destroyMobs", error);
  }
}

export default destroyMobs;
