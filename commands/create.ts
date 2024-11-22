// create
// switch on target to open create form for item, mob, room, zone, or user/character
import { itemTypes } from "../constants/ITEM_TYPE.js";
import { IUser } from "../model/classes/User.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import getAvailableExitsForCreateExit from "../util/getAvailableExitsForCreateExit.js";
import getAvailableExitsForCreateRoom from "../util/getAvailableExitsForCreateRoom.js";
import getZoneOfUser from "../util/getZoneofUser.js";
import makeMessage from "../util/makeMessage.js";
import { IParsedCommand } from "../util/parseCommand.js";
import userHasZoneAuthorId from "../util/userHasZoneAuthorId.js";

async function create(parsedCommand: IParsedCommand, user: IUser) {
  try {
    let target = parsedCommand.directObject;
    if (!target) {
      worldEmitter.emit(
        `messageFor${user.username}`,
        makeMessage(`rejection`, `Create what?`)
      );
      return;
    }

    const zone = await getZoneOfUser(user);
    if (!zone) {
      throw new Error(`Couldn't get ${user.username}'s zone.`);
    }

    if (target === "item" || target === "mob" || target === "room") {
      if (!userHasZoneAuthorId(zone.author.toString(), user)) {
        return;
      }
    }

    switch (target) {
      case `exit`: {
        const availableExits = await getAvailableExitsForCreateExit(user);
        worldEmitter.emit(`formPromptFor${user.username}`, {
          form: `createExit`,
          availableExits: availableExits,
        });
        break;
      }
      case `item`: {
        worldEmitter.emit(`formPromptFor${user.username}`, {
          form: `createItemBlueprintForm`,
          itemTypes: itemTypes,
        });
        break;
      }
      case `mob`: {
        worldEmitter.emit(`formPromptFor${user.username}`, {
          form: `createMobBlueprintForm`,
        });
        break;
      }
      case `room`: {
        const availableDirections = await getAvailableExitsForCreateRoom(user);
        worldEmitter.emit(`formPromptFor${user.username}`, {
          form: `createRoomForm`,
          availableDirections: availableDirections,
        });
        break;
      }
      // case `character`:
      // case `user`: {
      //   worldEmitter.emit(`formPromptFor${user.username}`, {
      //     form: `createUserForm`,
      //   });
      //   break;
      // }
      case `zone`: {
        if (user.unpublishedZoneTally >= 5) {
          worldEmitter.emit(
            `messageFor${user.username}`,
            makeMessage(
              `rejection`,
              `You already have 5 zones in progress! Work on publishing one of them first.`
            )
          );
          break;
        }

        worldEmitter.emit(`formPromptFor${user.username}`, {
          form: `createZoneForm`,
        });
        break;
      }
      default: {
        worldEmitter.emit(
          `messageFor${user.username}`,
          makeMessage(`rejection`, `Create what?`)
        );
        return;
      }
    }
  } catch (error: unknown) {
    catchErrorHandlerForFunction("create", error, user.name);
  }
}

export default create;
