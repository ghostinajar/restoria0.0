// editZone
// allows user to edit zone details
import logger from "../logger.js";
import { IUser } from "../model/classes/User.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import makeMessage from "../util/makeMessage.js";
import truncateDescription from "../util/truncateDescription.js";
import { IZoneData } from "./createZone.js";
import getZoneOfUser from "../util/getZoneofUser.js";
import Name from "../model/classes/Name.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import putNumberInRange from "../util/putNumberInRange.js";

async function editZone(zoneData: IZoneData, user: IUser) {
  try {
    truncateDescription(zoneData.description, user);
    const zone = await getZoneOfUser(user);
    if (!zone) {
      throw new Error(`Couldn't get ${user.username}'s zone.`);
    }
    zone.history.modifiedDate = new Date();

    if (zoneData.name !== zone.name) {
      // check updated zone name for duplicate in Names
      let nameIsTaken = await Name.findOne({
        name: zoneData.name,
      });
      if (nameIsTaken) {
        const message = makeMessage(`rejection`, `That name is taken.`);
        worldEmitter.emit(`messageFor${user.username}`, message);
        return;
      }

      // Register new name to Names
      const nameToRegister = new Name({ name: zoneData.name });
      const nameSaved = await nameToRegister.save();
      if (!nameSaved) {
        logger.error(
          `editZone couldn't save the name ${zoneData.name} to Names!`
        );
        makeMessage(
          `rejected`,
          `Sorry, we ran into a problem saving your zone changes!`
        );
        return;
      }
      zone.name = zoneData.name;
    }

    zone.minutesToRespawn = putNumberInRange(
      5,
      180,
      zoneData.minutesToRespawn,
      user
    );
    zone.description = zoneData.description;

    await zone.save();
    await zone.initRooms();
    worldEmitter.emit(
      `messageFor${user.username}`,
      makeMessage(`success`, `Zone changes saved!`)
    );
    return;
  } catch (error: unknown) {
    catchErrorHandlerForFunction("editZone", error, user.name);
  }
}

export default editZone;
