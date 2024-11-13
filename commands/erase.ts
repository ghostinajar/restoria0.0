// erase
// switch on target to open erase form for item, mob, room
import logger from "../logger.js";
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

async function erase(parsedCommand: IParsedCommand, user: IUser) {
  try {
    const target = parsedCommand.directObject;
    const zone: IZone = await getZoneOfUser(user);

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

    if (target === "zone") {
      worldEmitter.emit(
        `messageFor${user.username}`,
        makeMessage(
          `rejection`,
          `You can't erase a zone. Edit or erase its contents instead.`
        )
      );
      return;
    }

    if (!userHasZoneAuthorId(zone.author.toString(), user)) {
      return;
    }

    const helpArray = [
      `<span style="color:var(--red)">Erase cannot be undone!</span> We recommend saving all your writing somewhere,`,
      `(e.g. Google Drive), so you have a back up copy of your hard work.`,
      `Why not back it up now, before erasing, just in case?`,
    ];

    switch (target) {
      case `item`: {
        worldEmitter.emit(`formPromptFor${user.username}`, {
          form: `eraseItemBlueprintForm`,
          itemBlueprintNames: getItemBlueprintNamesFromZone(zone),
          helpArray: helpArray,
        });
        logger.debug(`user ${user.name} requested erase item form.`);
        break;
      }
      case `mob`: {
        worldEmitter.emit(`formPromptFor${user.username}`, {
          form: `eraseMobBlueprintForm`,
          mobBlueprintNames: getMobBlueprintNamesFromZone(zone),
          helpArray: helpArray,
        });
        break;
      }
      case `room`: {
        const originRoom = await getRoomOfUser(user);
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
          helpArray: helpArray,
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
    catchErrorHandlerForFunction("erase", error, user.name)
  }
}

export default erase;
