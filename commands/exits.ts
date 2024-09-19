// exits
import logger from "../logger.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import makeMessage from "../types/makeMessage.js";
import { IUser } from "../model/classes/User.js";
import { IRoom } from "../model/classes/Room.js";
import getRoomOfUser from "../util/getRoomOfUser.js";
import IMessage from "../types/Message.js";
import { IZone } from "../model/classes/Zone.js";

async function exits(user: IUser) {
  //get room
  const room: IRoom = await getRoomOfUser(user);
  let exitsArray: Array<IMessage> = [];
  //iterate over exits to push to exitsArray

  for (let [key, value] of Object.entries(room.exits)) {
    if (
      value &&
      key !== "$__parent" &&
      key !== "$__" &&
      key !== "$isNew" &&
      key !== "$__v" &&
      key !== "$_id" &&
      key !== "_doc"
    ) {
      //get zone (if exit.toExternalZone just use user's location.inZone)
      // logger.debug(`exits command finding zone for ${key} exit...`);
      let zone: IZone = await new Promise((resolve) => {
        worldEmitter.once(
          `zone${value.destinationLocation.inZone.toString()}Loaded`,
          resolve
        );
        worldEmitter.emit(`zoneRequested`, value.destinationLocation.inZone);
      });
      //get room
      // logger.debug(`exits command found zone ${zone.name}, finding room for ${key} exit...`);
      const room = zone.rooms.find(
        (room) =>
          room._id.toString() === value.destinationLocation.inRoom.toString()
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

      //create message with room name
      if (room) {
        // logger.debug(
        //   `exits command found room ${room.name}, creating message...`
        // );
        let message = makeMessage(`exit`, `${direction} ${room?.name}`);
        exitsArray.push(message);
      }
    }
  }
  // logger.debug(
  //   `exits command sending exitsArray: ${JSON.stringify(exitsArray)}`
  // );
  worldEmitter.emit(`messageArrayFor${user.username}`, exitsArray);
}

export default exits;
