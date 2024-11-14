// suggest
// allows user to leave a writing suggestion for the author of a room/item/mob
import mongoose from "mongoose";
import { IRoom } from "../model/classes/Room.js";
import { IUser } from "../model/classes/User.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import { IZone } from "../model/classes/Zone.js";
import getItemBlueprintNamesFromZone from "../util/getItemBlueprintNamesFromZone.js";
import getMobBlueprintNamesFromZone from "../util/getMobBlueprintNamesFromZone.js";
import getRoomOfUser from "../util/getRoomOfUser.js";
import getZoneOfUser from "../util/getZoneofUser.js";
import makeMessage from "../util/makeMessage.js";
import { IParsedCommand } from "../util/parseCommand.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";

async function suggest(parsedCommand: IParsedCommand, user: IUser) {
  try {
    let target = parsedCommand.directObject;
    const zone: IZone = await getZoneOfUser(user);
    if (!zone) {
      throw new Error(`Zone not found for user ${user.name}`)
    }
    const room = await getRoomOfUser(user);
    if (!room) {
      throw new Error(`Room not found for user ${user.name}`)
    }

    if (!target) {
      rejectSuggest(user);
      return;
    }

    if (zone.author !== user._id) {
      worldEmitter.emit(
        `messageFor${user.username}`,
        makeMessage(
          "rejection",
          `If you want to suggest in this zone, ask its author to make you an editor.`
        )
      );
      return;
    }

    const formData = {
      form: `suggestForm`,
      refersToObjectType: target,
      names: [
        { _id: new mongoose.Types.ObjectId(), name: "(current location)" },
      ],
      defaultOption: "",
    };

    switch (target) {
      case `item`:
        formData.refersToObjectType = "itemBlueprint";
        let itemBlueprintNames = getItemBlueprintNamesFromZone(zone);
        if (itemBlueprintNames) {
          formData.names = itemBlueprintNames;
        }
        formData.defaultOption =
          room.itemNodes[0]?.loadsBlueprintId?.toString();
        break;
      case `mob`:
        formData.refersToObjectType = "mobBlueprint";
        let mobBlueprintNames = getMobBlueprintNamesFromZone(zone);
        if (mobBlueprintNames) {
          formData.names = mobBlueprintNames;
        }
        formData.defaultOption = room.mobNodes[0]?.loadsBlueprintId?.toString();
        break;
      case `room`:
      case `zone`:
        break;
      default: {
        rejectSuggest(user);
        return;
      }
    }

    worldEmitter.emit(`formPromptFor${user.username}`, formData);
  } catch (error: unknown) {
    catchErrorHandlerForFunction("suggest", error, user.name);
  }
}

function rejectSuggest(user: IUser) {
  worldEmitter.emit(
    `messageFor${user.username}`,
    makeMessage(
      `rejection`,
      `What is your suggestion for? Try SUGGEST ITEM, SUGGEST MOB, SUGGEST ROOM, or SUGGEST ZONE`
    )
  );
}

export default suggest;
