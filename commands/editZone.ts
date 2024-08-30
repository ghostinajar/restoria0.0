import mongoose from "mongoose";
import logger from "../logger.js";
import { IUser } from "../model/classes/User.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import makeMessage from "../types/makeMessage.js";
import truncateDescription from "../util/truncateDescription.js";
import { IZoneData } from "./createZone.js";
import getZoneOfUser from "../util/getZoneofUser.js";
import Name from "../model/classes/Name.js";

async function editZone(zoneData: IZoneData, user: IUser) {
  truncateDescription(zoneData.description, user);
  const zone = await getZoneOfUser(user);
  zone.history.modifiedDate = new Date();

  if (zoneData.name !== zone.name) {
    // check updated zone name for duplicate in Names
    let nameIsTaken = await Name.findOne({
      name: zoneData.name,
    });
    if (nameIsTaken) {
      const message = makeMessage(`rejection`, `That name is taken.`);
      worldEmitter.emit(`messageFor${user.username}`, message);
      return null;
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
      return null;
    }
    zone.name = zoneData.name;
  }

  zone.minutesToRepop = zoneData.minutesToRepop;
  zone.description = zoneData.description;

  await zone.save();
  worldEmitter.emit(
    `messageFor${user.username}`,
    makeMessage(`success`, `Zone chages saved!`)
  );
  return;
}

export default editZone;
