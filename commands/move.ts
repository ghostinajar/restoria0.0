// move
// switches on directions input by user to move between rooms
import logger from "../logger.js";
import { IRoom } from "../model/classes/Room";
import { IUser } from "../model/classes/User.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import makeMessage from "../util/makeMessage.js";
import getRoomOfUser from "../util/getRoomOfUser.js";
import { IParsedCommand } from "../util/parseCommand.js";
import relocateUser from "../util/relocateUser.js";

async function move(parsedCommand: IParsedCommand, user: IUser) {
  try {
    let requestedDirection = parsedCommand.commandWord;

    // expand abbreviations
    switch (requestedDirection) {
      case `n`: {
        requestedDirection = `north`;
        break;
      }
      case `e`: {
        requestedDirection = `east`;
        break;
      }
      case `s`: {
        requestedDirection = `south`;
        break;
      }
      case `w`: {
        requestedDirection = `west`;
        break;
      }
      case `u`: {
        requestedDirection = `up`;
        break;
      }
      case `d`: {
        requestedDirection = `down`;
        break;
      }
      default:
        break;
    }
    // make sure requestedDirection is of type keyof IRoom["exits"]
    const direction = requestedDirection as keyof IRoom["exits"];

    // get origin room of user
    const originRoom = await getRoomOfUser(user);
    if (!originRoom) {
      throw new Error( `Error in move, couldn't find origin room for user ${user.name}`)
    }

    // check if the exit is defined
    const exit = originRoom.exits[direction];
    if (!exit || !originRoom.exits || !originRoom.exits[direction]) {
      worldEmitter.emit(
        `messageFor${user.username}`,
        makeMessage(`rejection`, `There's no exit in that direction.`)
      );
      return;
    }

    // get destination room
    const destinationRoom = await new Promise((resolve) => {
      worldEmitter.once(
        `zoneManagerReturningRoom${originRoom.exits[
          direction
        ]!.destinationLocation.inRoom.toString()}`,
        resolve
      );
      worldEmitter.emit(
        `roomRequested`,
        originRoom.exits[direction]!.destinationLocation
      );
    });
    if (!destinationRoom) {
      logger.error(
        `no room attached to exit ${direction} from ${originRoom.name}!`
      );
      worldEmitter.emit(
        `messageFor${user.username}`,
        makeMessage(`rejection`, `A mysterious force blocks your way.`)
      );
      return;
    }

    await relocateUser(user, originRoom.exits[direction]!.destinationLocation);

    // Message user's origin room
    worldEmitter.emit(
      `messageFor${user.username}sRoom`,
      makeMessage(`userMove`, `${user.name} went ${direction}.`)
    );

    // Message user's destination room
    worldEmitter.emit(
      `messageFor${user.username}sRoom`,
      makeMessage(`userMove`, `${user.name} arrived.`)
    );

    // Message user
    worldEmitter.emit(
      `messageFor${user.username}`,
      makeMessage(`userMove`, `You move ${requestedDirection}.`)
    );
  } catch (error: unknown) {
    worldEmitter.emit(
      `messageFor${user.username}`,
      makeMessage(
        "rejection",
        `There was an error on our server. Ralu will have a look at it soon!`
      )
    );
    if (error instanceof Error) {
      logger.error(`"move" error for user ${user.username}: ${error.message}`);
    } else {
      logger.error(`"move" error for user ${user.username}: ${error}`);
    }
  }
}

export default move;
