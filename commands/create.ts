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
import help from "./help.js";

async function create(parsedCommand: IParsedCommand, user: IUser) {
  try {
    let target = parsedCommand.directObject;
    if (!target) {
      worldEmitter.emit(
        `messageFor${user.username}`,
        makeMessage(`rejection`, `Create what? Try CREATE ITEM, CREATE MOB, CREATE ROOM, or CREATE ZONE.`)
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
        help(
          {
            commandWord: "help",
            directObject: "create_exit",
          },
          user
        );
        const availableExits = await getAvailableExitsForCreateExit(user);
        worldEmitter.emit(`formPromptFor${user.username}`, {
          form: `createExitForm`,
          availableExits: availableExits,
        });
        break;
      }
      case `object`:
        worldEmitter.emit(
          `messageFor${user.username}`,
          makeMessage(`help`, `Objects are called items in Restoria.`)
        );
      case `item`: {
        help(
          {
            commandWord: "help",
            directObject: "create_item",
          },
          user
        );
        worldEmitter.emit(`formPromptFor${user.username}`, {
          form: `createItemBlueprintForm`,
          itemTypes: itemTypes,
        });
        break;
      }
      case `monster`:
      case `npc`:
        worldEmitter.emit(
          `messageFor${user.username}`,
          makeMessage(
            `help`,
            `Monsters and NPCs are considered mobs in Restoria.`
          )
        );
      case `mob`: {
        help(
          {
            commandWord: "help",
            directObject: "create_mob",
          },
          user
        );
        worldEmitter.emit(`formPromptFor${user.username}`, {
          form: `createMobBlueprintForm`,
        });
        break;
      }
      case `room`: {
        help(
          {
            commandWord: "help",
            directObject: "create_room",
          },
          user
        );
        const availableDirections = await getAvailableExitsForCreateRoom(user);
        if (availableDirections.length === 0) {
          worldEmitter.emit(
            `messageFor${user.username}`,
            makeMessage(
              `rejection`,
              `There are already rooms in every direction! Create somewhere else.`
            )
          );
          break;
        } else {
          worldEmitter.emit(`formPromptFor${user.username}`, {
            form: `createRoomForm`,
            availableDirections: availableDirections,
          });
          break;
        }
      }
      case `zone`: {
        if (user.unpublishedZoneTally >= 5 && !user.isAdmin) {
          worldEmitter.emit(
            `messageFor${user.username}`,
            makeMessage(
              `rejection`,
              `You already have 5 zones in progress! Work on publishing one of them first.`
            )
          );
          break;
        }
        help(
          {
            commandWord: "help",
            directObject: "create_zone",
          },
          user
        );
        worldEmitter.emit(`formPromptFor${user.username}`, {
          form: `createZoneForm`,
        });
        break;
      }
      default: {
        worldEmitter.emit(
          `messageFor${user.username}`,
          makeMessage(`rejection`, `Create what? Try CREATE ITEM, CREATE MOB, CREATE ROOM, or CREATE ZONE.`)
        );
        return;
      }
    }
  } catch (error: unknown) {
    catchErrorHandlerForFunction("create", error, user.name);
  }
}

export default create;
