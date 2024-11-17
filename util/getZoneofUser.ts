import recall from "../commands/recall.js";
import logger from "../logger.js";
import { IUser } from "../model/classes/User.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import { IZone } from "../model/classes/Zone.js";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
import makeMessage from "./makeMessage.js";

async function getZoneOfUser(user: IUser) {
  try {
    let zone: IZone = await new Promise((resolve) => {
      worldEmitter.once(
        `zone${user.location.inZone.toString()}Loaded`,
        resolve
      );
      worldEmitter.emit(`zoneRequested`, user.location.inZone);
    });
    if (!zone) {
      logger.error(
        `getZoneofUser couldn't find a zone, resetting user location...`
      );
      worldEmitter.emit(
        `messageFor${user.username}`,
        makeMessage(
          `rejection`,
          `There was an error with your location. You're being recalled to Restoria City...`
        )
      );
      await recall(user);
      zone = await new Promise((resolve) => {
        worldEmitter.once(
          `zone${user.location.inZone.toString()}Loaded`,
          resolve
        );
        worldEmitter.emit(`zoneRequested`, user.location.inZone);
      });
    }
    return zone;
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`getZoneOfUser`, error, user?.name);
  }
}

export default getZoneOfUser;
