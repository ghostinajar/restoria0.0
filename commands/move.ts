// move
import logger from "../logger.js";
import { IRoom } from "../model/classes/Room";
import { IUser } from "../model/classes/User.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import makeMessage from "../types/makeMessage.js";
import { IParsedCommand } from "../util/parseCommand.js";
import look from "./look.js";

async function move(parsedCommand: IParsedCommand, agent: IUser) {
  let requestedDirection = parsedCommand.commandWord;

  // Get origin room of agent
  const originRoom: IRoom = await new Promise((resolve) => {
    worldEmitter.once(
      `zoneManagerReturningRoom${agent.location.inRoom.toString()}`,
      resolve
    );
    worldEmitter.emit(`roomRequested`, agent.location);
  });
  if (!originRoom) {
    logger.error(
      `Error in move, couldn't find origin room for agent ${agent.name}`
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
    `move command verifying ${JSON.stringify(exit)} exit in originRoom`
  );
  if (!exit || !originRoom.exits || !originRoom.exits[direction]) {
    logger.debug(`no exit!`);
    if (agent.username) {
      worldEmitter.emit(
        `messageFor${agent.username}`,
        makeMessage(`rejection`, `There's no exit in that direction.`)
      );
    }
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
    if (agent.username) {
      worldEmitter.emit(
        `messageFor${agent.username}`,
        makeMessage(`rejection`, `A mysterious force blocks your way.`)
      );
    }
    return;
  }
  logger.debug(`move command got destination room ${destinationRoom.name}`);

  // Remove user from users or mobs array in originRoom
  if (agent.username) {
    originRoom.removeEntityFrom(`users`, agent);
    logger.debug(
      `User ${agent.name} removed from ${
        originRoom.name
      }. Users remaining: ${originRoom.users.map((user) => user.name)}`
    );
  } else {
    originRoom.removeEntityFrom(`mobs`, agent);
    logger.debug(
      `Mob ${agent.name} removed from ${
        originRoom.name
      }. Mobs remaining: ${originRoom.mobs.map((mob) => mob.name)}`
    );
  }
  // Alert destination room to add user to users or mobs array
  if (agent.username) {
    destinationRoom.addEntityTo(`users`, agent);
    logger.debug(
      `User ${agent.name} added to ${
        destinationRoom.name
      }. Users in room: ${destinationRoom.users.map((user) => user.name)}`
    );
  } else {
    destinationRoom.addEntityTo(`mobs`, agent);
    logger.debug(
      `Mob ${agent.name} added to ${
        destinationRoom.name
      }. Mobs in room: ${destinationRoom.mobs.map((mob) => mob.name)}`
    );
  }

  //Alert socket to update User's ioRoom
  if (agent.username) {
    worldEmitter.emit(
      `userChangingRooms`,
      originRoom._id.toString(),
      originRoom.fromZoneId.toString(),
      destinationRoom._id.toString(),
      destinationRoom.fromZoneId.toString()
    );
  }

  // Update agent.location
  agent.location.inRoom = destinationRoom._id;
  agent.location.inZone = destinationRoom.fromZoneId;
  logger.debug(
    `agent ${agent.name}'s location changed to ${JSON.stringify(
      agent.location
    )}`
  );

  // message agent's origin room
  if (agent.username) {
    worldEmitter.emit(
      `messageForRoomId`,
      originRoom._id.toString(),
      makeMessage(`userMove`, `${agent.name} went ${direction}.`)
    );
  } else {
    worldEmitter.emit(
      `messageForRoomId`,
      originRoom._id.toString(),
      makeMessage(`mobMove`, `${agent.name} went ${direction}.`)
    );
  }

  // Message user and user's room
  if (agent.username) {
    worldEmitter.emit(
      `messageFor${agent.username}`,
      makeMessage(`userMove`, `You move ${requestedDirection}.`)
    );
    worldEmitter.emit(
      `messageForRoomId`,
      destinationRoom._id.toString(),
      makeMessage(`userMove`, `${agent.name} has arrived.`)
    );
  } else {
    worldEmitter.emit(
      `messageForRoomId`,
      destinationRoom._id.toString(),
      makeMessage(`mobMove`, `${agent.name} has arrived.`)
    );
  }

  if (agent.username) {
    look({ commandWord: `look` }, agent);
  }
}

export default move;
