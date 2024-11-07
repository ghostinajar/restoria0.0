// createZone
// allows user to create a new zone

import makeMessage from "../util/makeMessage.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import logger from "../logger.js";
import { IUser } from "../model/classes/User.js";
import COMPLETION_STATUS from "../constants/COMPLETION_STATUS.js";
import { IDescription } from "../model/classes/Description.js";
import truncateDescription from "../util/truncateDescription.js";
import exits from "./exits.js";
import Zone from "../model/classes/Zone.js";
import Name from "../model/classes/Name.js";
import mongoose from "mongoose";
import ROOM_TYPE from "../constants/ROOM_TYPE.js";
import { historyStartingNow } from "../model/classes/History.js";

export interface IZoneData {
  name: string;
  minutesToRespawn: number;
  description: IDescription;
}

async function createZone(zoneFormData: IZoneData, user: IUser) {
  try {
    if (user.unpublishedZoneTally > 4) {
      worldEmitter.emit(
        `messageFor${user.username}`,
        makeMessage(
          "rejection",
          `Sorry, you can't have more then 5 unpublished zones at a time.`
        )
      );
      return;
    }

    let nameIsTaken = await Name.findOne({
      name: zoneFormData.name,
    });
    if (nameIsTaken) {
      worldEmitter.emit(
        `messageFor${user.username}`,
        makeMessage("rejection", `That name is taken.`)
      );
      return;
    }

    const zoneDescription = truncateDescription(zoneFormData.description, user);
    const newZoneId = new mongoose.Types.ObjectId();
    let newZoneData: any = {
      _id: newZoneId,
      author: user._id,
      name: zoneFormData.name,
      history: historyStartingNow(),
      description: zoneDescription,
      rooms: [
        {
          _id: new mongoose.Types.ObjectId(),
          author: user._id,
          fromZoneId: newZoneId,
          roomType: ROOM_TYPE.NONE,
          name: `An Empty Room`,
          history: {
            creationDate: new Date(),
            modifiedDate: new Date(),
            completionStatus: COMPLETION_STATUS.DRAFT,
          },
          playerCap: 30,
          mobCap: 30,
          isDark: false,
          isIndoors: false,
          isOnWater: false,
          isUnderwater: false,
          noMounts: false,
          noMobs: false,
          noMagic: false,
          noCombat: false,
          itemsForSale: [],
          mountIdForSale: [],
          mapCoords: [39, 39, 0],
          description: {
            examine: `Every new zone starts with one empty room. Type EDIT ROOM to bring it to life, or CREATE ROOM to add`,
          },
          exits: {},
          mobNodes: [],
          itemNodes: [],
        },
      ],
      mobBlueprints: [],
      itemBlueprints: [],
      suggestions: [],
      minutesToRespawn: zoneFormData.minutesToRespawn,
    };

    // create and save to db
    const newZone = new Zone(newZoneData);
    if (!newZone) {
      logger.error(`createZone couldn't save new zone ${newZoneData.name}!`);
      worldEmitter.emit(
        `messageFor${user.username}`,
        makeMessage(
          "rejection",
          `There was an error on our server. Ralu will have a look at it soon!`
        )
      );
      return;
    }
    if (user && user._id) {
      newZoneData.author = user._id;
    }
    await newZone.save();
    logger.info(`Author "${user.name}" created zone "${newZoneData.name}".`);
    const nameToRegister = new Name({ name: newZoneData.name });
    const nameSaved = await nameToRegister.save();
    if (!nameSaved) {
      throw new Error(
        `createZone couldn't save the name ${newZoneData.name} to Names!`
      );
    }

    if (!user.unpublishedZoneTally) {
      user.unpublishedZoneTally = 0;
    }
    user.unpublishedZoneTally++;
    user.save();
    worldEmitter.emit(
      `messageFor${user.username}`,
      makeMessage("success", `You created a zone: ${newZoneData.name}!`)
    );
    await exits(user);
  } catch (error: unknown) {
    worldEmitter.emit(
      `messageFor${user.username}`,
      makeMessage(
        "rejection",
        `There was an error on our server. Ralu will have a look at it soon!`
      )
    );
    if (error instanceof Error) {
      logger.error(`createZone error for user ${user.username}: ${error.message}`);
    } else {
      logger.error(`createZone error for user ${user.username}: ${error}`);
    }
  }
}

export default createZone;
