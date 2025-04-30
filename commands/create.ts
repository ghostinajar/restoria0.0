// create
// switch on target to open create form for item, mob, room, zone, or user/character
import { processDirection } from "../constants/DIRECTIONS.js";
import { itemTypes } from "../constants/ITEM_TYPE.js";
import { IUser } from "../model/classes/User.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import expandAbbreviatedString from "../util/expandAbbreviatedString.js";
import getAvailableExitsForCreateExit from "../util/getAvailableExitsForCreateExit.js";
import getAvailableExitsForCreateRoom from "../util/getAvailableExitsForCreateRoom.js";
import getZoneOfUser from "../util/getZoneofUser.js";
import makeMessage from "../util/makeMessage.js";
import messageToUsername from "../util/messageToUsername.js";
import { IParsedCommand } from "../util/parseCommand.js";
import userHasZoneAuthorId from "../util/userHasZoneAuthorId.js";
import createExit from "./createExit.js";
import createRoom from "./createRoom.js";
import help from "./help.js";

async function create(parsedCommand: IParsedCommand, user: IUser) {
  try {
    const rejectionString = `Create what? Try CREATE ITEM, CREATE MOB, CREATE ROOM, or CREATE ZONE.`;

    // fail if target isn't provided
    let providedTarget = parsedCommand.directObject;
    if (!providedTarget) {
      messageToUsername(user.username, rejectionString, `help`, true);
      return;
    }

    // fail if target is invalid
    const validTargets = [
      "creature",
      "exit",
      "item",
      "mob",
      "monster",
      "npc",
      "object",
      "room",
      "zone",
    ];
    let target = expandAbbreviatedString(providedTarget, validTargets);
    if (!target || !validTargets.includes(target)) {
      messageToUsername(user.username, rejectionString, `help`, true);
      return;
    }

    const zone = await getZoneOfUser(user);
    if (!zone) {
      throw new Error(`Couldn't get ${user.username}'s zone.`);
    }

    // fail if user isn't author of the zone they're in
    if (!userHasZoneAuthorId(zone.author.toString(), user)) {
      //NB userHasZoneAuthorId has messaged unauthorized user
      return;
    }

    let creatureString = "creature";
    if (creatureString.startsWith("creature")) {
      messageToUsername(
        user.username,
        `In Restoria, we call a creature a MOB. HELP MOB for more info.`
      );
    }

    const providedDirection = parsedCommand.indirectObject?.toLowerCase();

    switch (target) {
      case `exit`: {
        help(
          {
            commandWord: "help",
            directObject: "create_exit",
          },
          user
        );

        const processedDirection = processDirection(providedDirection, user);
        if (!processedDirection) {
          // NB processDirection has handled notifying user of missing/invalid direction
          return;
        }

        // handle no room in that direction
        const availableExits = await getAvailableExitsForCreateExit(user);
        if (!availableExits || !availableExits.includes(processedDirection)) {
          messageToUsername(
            user.username,
            `Sorry, we can't create an exit ${processedDirection}. Try CREATE ROOM.`,
            `rejection`,
            true
          );
          return;
        }

        await createExit(processedDirection, user);
        break;
      }
      case `object`:
        messageToUsername(
          user.username,
          `Objects are called items in Restoria.`,
          `help`,
          true
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
      case `creature`:
      case `npc`:
        messageToUsername(
          user.username,
          `A ${target} is called a mob in Restoria. HELP MOB for more info.`,
          `help`,
          true
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
        const processedDirection = processDirection(providedDirection, user);
        if (!processedDirection) {
          // NB processDirection has handled notifying user of missing/invalid direction
          return;
        }

        const availableDirections = await getAvailableExitsForCreateRoom(user);
        // handle no available directions for new room
        if (availableDirections.length === 0) {
          worldEmitter.emit(
            `messageFor${user.username}`,
            makeMessage(
              `rejection`,
              `There are already rooms in every direction! CREATE somewhere else.`
            )
          );
          break;
        }

        // handle direct room creation
        await createRoom(
          processedDirection,
          user,
          parsedCommand.string || `This zone's author needs to name this room.`
        );
        break;
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
        messageToUsername(user.username, rejectionString, `help`, true);
        return;
      }
    }
  } catch (error: unknown) {
    catchErrorHandlerForFunction("create", error, user.name);
  }
}

export default create;
