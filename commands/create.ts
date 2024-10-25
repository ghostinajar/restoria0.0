// create
import { itemTypes } from "../constants/ITEM_TYPE.js";
import logger from "../logger.js";
import { IUser } from "../model/classes/User.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import makeMessage from "../types/makeMessage.js";
import { IParsedCommand } from "../util/parseCommand.js";
import unusedExitsForUser from "../util/unusedExitsForUser.js";
import userIsAuthorOfZoneId from "../util/userIsAuthorOfZoneId.js";

async function create(parsedCommand: IParsedCommand, user: IUser) {
  let target = parsedCommand.directObject;
  if (!target) {
    worldEmitter.emit(
      `messageFor${user.username}`,
      makeMessage(`rejection`, `Create what?`)
    );
    return;
  }

  if (
    target === "item" ||
    target === "mob" ||
    target === "room"
  ) {
    if(!userIsAuthorOfZoneId(user.location.inZone.toString(), user))
    {return;}
  }

  switch (target) {
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
      const unusedExits = await unusedExitsForUser(user);
      worldEmitter.emit(`formPromptFor${user.username}`, {
        form: `createRoomForm`,
        unusedExits: unusedExits,
      });
      break;
    }
    case `character`:
    case `user`: {
      worldEmitter.emit(`formPromptFor${user.username}`, {
        form: `createUserForm`,
      });
      break;
    }
    case `zone`: {
      if (user.unpublishedZoneTally >= 5) {
        worldEmitter.emit(
          `messageFor${user.username}`,
          makeMessage(`rejection`, `You already have 5 zones in progress! Work on publishing one of them first.`)
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
}

export default create;
