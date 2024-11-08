// exits
// shows user the exits from their current room
import logger from "../logger.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import makeMessage from "../util/makeMessage.js";
import { IUser } from "../model/classes/User.js";
import getRoomOfUser from "../util/getRoomOfUser.js";
import IMessage from "../types/Message.js";
import getZoneOfUser from "../util/getZoneofUser.js";

async function exits(user: IUser) {
  try {
    const room = await getRoomOfUser(user);
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
        // TODO if exit.toExternalZone, use user's location.inZone
        let zone = await getZoneOfUser(user);
        const room = zone.rooms.find(
          (room) =>
            room._id.toString() === value.destinationLocation.inRoom.toString()
        );

        let direction = ``;
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
          let message = makeMessage(`exit`, `${direction} ${room?.name}`);
          exitsArray.push(message);
        }
      }
    }
    worldEmitter.emit(`messageArrayFor${user.username}`, exitsArray);
  } catch (error: unknown) {
    worldEmitter.emit(
      `messageFor${user.username}`,
      makeMessage(
        "rejection",
        `There was an error on our server. Ralu will have a look at it soon!`
      )
    );
    if (error instanceof Error) {
      logger.error(`"exits" command error for user ${user.username}: ${error.message}`);
    } else {
      logger.error(`"exits" command error for user ${user.username}: ${error}`);
    }
  }
}

export default exits;
