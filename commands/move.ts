// move
import logger from "../logger.js";
import { IRoom } from "../model/classes/Room";
import { IUser } from "../model/classes/User.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import makeMessage from "../types/makeMessage.js";
import getRoomOfUser from "../util/getRoomOfUser.js";
import { IParsedCommand } from "../util/parseCommand.js";
import exits from "./exits.js";
import look from "./look.js";

async function move(parsedCommand: IParsedCommand, user: IUser) {
  let requestedDirection = parsedCommand.commandWord;
  logger.debug(`move command says ${user.name}'s location is ${JSON.stringify(user.location)}`)

  // Get origin room of user
  const originRoom: IRoom = await getRoomOfUser(user);
  if (!originRoom) {
    logger.error(
      `Error in move, couldn't find origin room for user ${user.name}`
    );
    return;
  }
  logger.debug(`move command got origin room ${originRoom.name}`);

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
  // Ensure requestedDirection is of type keyof IRoom["exits"]
  const direction = requestedDirection as keyof IRoom["exits"];
  // Check if the exit is defined
  const exit = originRoom.exits[direction];
  logger.debug(
    `move command verifying ${JSON.stringify(direction)} exit in originRoom..`
  );
  if (!exit || !originRoom.exits || !originRoom.exits[direction]) {
    logger.debug(`no exit!`);
    worldEmitter.emit(
      `messageFor${user.username}`,
      makeMessage(`rejection`, `There's no exit in that direction.`)
    );
    return;
  }

  // get destination Room
  const destinationRoom: IRoom = await new Promise((resolve) => {
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
  logger.debug(`move command got destination room ${destinationRoom.name}`);

  // Remove user from originRoom users array
  originRoom.removeEntityFrom(`users`, user);
  logger.debug(
    `User ${user.name} removed from ${
      originRoom.name
    }. Users remaining: ${originRoom.users.map((user) => user.name)}`
  );

  // Add user to destinationRoom users array
  destinationRoom.addEntityTo(`users`, user);
  logger.debug(
    `User ${user.name} added to ${
      destinationRoom.name
    }. Users in room: ${destinationRoom.users.map((user) => user.name)}`
  );

  // Message user's origin room
  worldEmitter.emit(
    `messageFor${user.username}sRoom`,
    makeMessage(`userMove`, `${user.name} went ${direction}.`)
  );

  // Update user.location
  user.location.inRoom = destinationRoom._id;
  user.location.inZone = destinationRoom.fromZoneId;
  logger.debug(
    `move command says ${user.name}'s location changed to ${JSON.stringify(user.location)}`
  );

  // Alert socket to update User's ioRoom
  worldEmitter.emit(
    `user${user.username}ChangingRooms`,
    originRoom._id.toString(),
    originRoom.fromZoneId.toString(),
    destinationRoom._id.toString(),
    destinationRoom.fromZoneId.toString()
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

  await look({ commandWord: `look` }, user);
  await exits(user);
}

export default move;
