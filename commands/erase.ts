// erase
// switch on target to prepare and process erase commands (e.g. exit, item, room, mob, etc.)
import { IUser } from "../model/classes/User.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import { IZone } from "../model/classes/Zone.js";
import makeMessage from "../util/makeMessage.js";
import getItemBlueprintNamesFromZone from "../util/getItemBlueprintNamesFromZone.js";
import getMobBlueprintNamesFromZone from "../util/getMobBlueprintNamesFromZone.js";
import getRoomOfUser from "../util/getRoomOfUser.js";
import getZoneOfUser from "../util/getZoneofUser.js";
import { IParsedCommand } from "../util/parseCommand.js";
import userHasZoneAuthorId from "../util/userHasZoneAuthorId.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import {
  directionCorrectionString,
  directions,
  directionsAbbrev,
  expandAbbreviatedDirection,
} from "../constants/DIRECTIONS.js";
import help from "./help.js";
import logger from "../logger.js";
import messageToUsername from "../util/messageToUsername.js";
import eraseExit from "./eraseExit.js";

async function erase(parsedCommand: IParsedCommand, user: IUser) {
  try {
    const target = parsedCommand.directObject;
    const zone = await getZoneOfUser(user);
    if (!zone) {
      throw new Error(`Couldn't get ${user.username}'s zone.`);
    }

    if (!target) {
      worldEmitter.emit(
        `messageFor${user.username}`,
        makeMessage(
          `rejection`,
          `Erase what? Try ERASE ROOM, ERASE ITEM, or ERASE MOB.`
        )
      );
      return;
    }

    if (target === "user" || target === "character") {
      worldEmitter.emit(
        `messageFor${user.username}`,
        makeMessage(
          `rejection`,
          `To erase a user, contact Ralu or another game administrator.`
        )
      );
      worldEmitter.emit(
        `messageFor${user.username}`,
        makeMessage(
          `rejection`,
          `Except in special circumstances, we'll only erase one of your users per month.`
        )
      );
      return;
    }

    if (target === "zone" && !user.isAdmin) {
      worldEmitter.emit(
        `messageFor${user.username}`,
        makeMessage(
          `rejection`,
          `You can't erase a zone. Edit or erase its contents instead.`
        )
      );
      return;
    } else if (target === "zone" && user.isAdmin) {
      logger.info(`Admin ${user.name} authorized for "erase zone" command.`);
      worldEmitter.emit(`formPromptFor${user.username}`, {
        form: `eraseZoneForm`,
      });
      return;
    }

    if (!userHasZoneAuthorId(zone.author.toString(), user)) {
      return;
    }

    switch (target) {
      case `exit`: {
        help(
          {
            commandWord: "help",
            directObject: "erase_exit",
          },
          user
        );

        const providedDirection = parsedCommand.indirectObject?.toLowerCase();
        if (!providedDirection) {
          messageToUsername(
            user.username,
            `Which direction? E.g. ERASE EXIT NORTH or ERASE EXIT N.`,
            `rejection`,
            true
          );
          return;
        }

        // handle invalid direction provided
        if (
          !directions.includes(providedDirection) &&
          !directionsAbbrev.includes(providedDirection)
        ) {
          messageToUsername(
            user.username,
            directionCorrectionString,
            `rejection`,
            true
          );
          return;
        }

        // handle direction abbreviation
        const expandedDirection = expandAbbreviatedDirection(providedDirection);
        if (!expandedDirection) {
          throw new Error(
            `Couldn't expand direction ${providedDirection} for ${user.username}.`
          );
        }

        // handle no exit in that direction
        const room = await getRoomOfUser(user);
        if (!room) {
          throw new Error(`No room found for user ${user.name}`);
        }
        let eraseableExits: Array<string> = [];
        directions.forEach((direction) => {
          if (room.exits[direction]) {
            eraseableExits.push(direction);
          }
        });
        if (!eraseableExits.includes(expandedDirection)) {
          messageToUsername(
            user.username,
            `There's no exit ${expandedDirection} to erase.`,
            `rejection`,
            true
          );
          return;
        }
        console.log(expandedDirection);
        await eraseExit(expandedDirection, user);
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
            directObject: "erase",
          },
          user
        );
        worldEmitter.emit(`formPromptFor${user.username}`, {
          form: `eraseItemBlueprintForm`,
          itemBlueprintNames: getItemBlueprintNamesFromZone(zone),
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
            directObject: "erase",
          },
          user
        );
        worldEmitter.emit(`formPromptFor${user.username}`, {
          form: `eraseMobBlueprintForm`,
          mobBlueprintNames: getMobBlueprintNamesFromZone(zone),
        });
        break;
      }
      case `room`: {
        help(
          {
            commandWord: "help",
            directObject: "erase",
          },
          user
        );
        const originRoom = await getRoomOfUser(user);
        if (!originRoom) {
          throw new Error(`Room not found for user ${user.name}`);
        }
        let exitNames: Array<{ _id: string; name: string }> = [];
        for (let [key, value] of Object.entries(originRoom.exits)) {
          if (
            value &&
            key !== "$__parent" &&
            key !== "$__" &&
            key !== "$isNew" &&
            key !== "$__v" &&
            key !== "$_id" &&
            key !== "_doc"
          ) {
            // get the exit's destination zone (in case it's an external zone)
            // logger.debug(`exits command look for destination zone for ${key} exit from ${originRoom.name}...`);

            let toZone: IZone = await new Promise((resolve) => {
              worldEmitter.once(
                `zone${value.destinationLocation.inZone.toString()}Loaded`,
                resolve
              );
              worldEmitter.emit(
                `zoneRequested`,
                value.destinationLocation.inZone
              );
            });
            // get room of exit
            // logger.debug(`exits command found zone ${toZone.name}, finding room for ${key} exit...`);
            const toRoom = toZone.rooms.find(
              (room) =>
                room._id.toString() ===
                value.destinationLocation.inRoom.toString()
            );

            let direction: string = ``;
            switch (key) {
              case "north": {
                direction = `North:  `;
                break;
              }
              case "east": {
                direction = `East:   `;
                break;
              }
              case "south": {
                direction = `South:  `;
                break;
              }
              case "west": {
                direction = `West:   `;
                break;
              }
              case "up": {
                direction = `Up:     `;
                break;
              }
              case "down": {
                direction = `Down:   `;
                break;
              }
              default:
                break;
            }
            if (toRoom) {
              let exit = {
                _id: toRoom._id.toString(),
                name: `${direction} ${toRoom.name}`,
              };
              exitNames.push(exit);
            }
          }
        }
        worldEmitter.emit(`formPromptFor${user.username}`, {
          form: `eraseRoomForm`,
          exitNames: exitNames,
        });
        break;
      }
      default: {
        worldEmitter.emit(
          `messageFor${user.username}`,
          makeMessage(
            `rejection`,
            `Uh, you can't erase that. Try ERASE ROOM, ERASE ITEM, or ERASE MOB.`
          )
        );
        return;
      }
    }
  } catch (error: unknown) {
    catchErrorHandlerForFunction("erase", error, user.name);
  }
}

export default erase;
