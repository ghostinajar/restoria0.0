import logger from "../logger.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import makeMessage from "../types/makeMessage.js";
import look from "./look.js";
async function move(parsedCommand, agent) {
    let requestedDirection = parsedCommand.commandWord;
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
        default: break;
    }
    // Ensure requestedDirection is of type keyof IRoom["exits"]
    const direction = requestedDirection;
    // Get origin room of agent
    const originRoom = await new Promise((resolve) => {
        worldEmitter.once(`zoneManagerReturningRoom${agent.location.inRoom.toString()}`, resolve);
        worldEmitter.emit(`roomRequested`, agent.location);
    });
    if (!originRoom) {
        logger.error(`Error in move, couldn't find origin room for agent ${agent.name}`);
        return;
    }
    // If exit doesn't exist in origin room, emit failure message to user, return
    if (!(direction in originRoom.exits) && agent.username) {
        worldEmitter.emit(`messageFor${agent.username}`, makeMessage(`rejection`, `There's no exit in that direction.`));
        return;
    }
    // (for when it's a mob)
    if (!(direction in originRoom.exits)) {
        return;
    }
    // Alert origin room to remove user from users or mobs array
    if (agent.username) {
        originRoom.removeEntityFrom(`users`, agent);
        logger.debug(`User ${agent.name} removed from ${originRoom.name}, users remaining: ${originRoom.users.map(user => user.name)}`);
    }
    else {
        originRoom.removeEntityFrom(`mobs`, agent);
        logger.debug(`Mob ${agent.name} removed from ${originRoom.name}, mobs remaining: ${originRoom.mobs.map(mob => mob.name)}`);
    }
    // get destination Room
    const destinationRoom = await new Promise((resolve) => {
        worldEmitter.once(`zoneManagerReturningRoom${originRoom.exits[direction].destinationLocation.inRoom.toString()}`, resolve);
        worldEmitter.emit(`roomRequested`, originRoom.exits[direction].destinationLocation);
    });
    // Alert destination room to add user to users or mobs array
    if (agent.username) {
        destinationRoom.addEntityTo(`users`, agent);
        logger.debug(`User ${agent.name} added to ${destinationRoom.name}. Users in room: ${destinationRoom.users.map(user => user.name)}`);
    }
    else {
        destinationRoom.addEntityTo(`mobs`, agent);
        logger.debug(`Mob ${agent.name} added to ${destinationRoom.name}. Mobs in room: ${destinationRoom.mobs.map(mob => mob.name)}`);
    }
    // Update agent.location
    agent.location.inRoom = destinationRoom._id;
    agent.location.inZone = destinationRoom.fromZoneId;
    // Message user and user's room
    if (agent.username) {
        await worldEmitter.emit(`messageFor${agent.username}`, makeMessage(`userMove`, `You move ${requestedDirection}.`));
    }
    ;
    await worldEmitter.emit(`messageFor${agent.username}sRoom`, makeMessage(`userMove`, `${agent.name} has arrived.`));
    if (agent.username) {
        look({ commandWord: `look` }, agent);
    }
    ;
}
export default move;
