// move
import logger from "../logger.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import makeMessage from "../util/makeMessage.js";
import getRoomOfUser from "../util/getRoomOfUser.js";
import relocateUser from "../util/relocateUser.js";
async function move(parsedCommand, user) {
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
    // Ensure requestedDirection is of type keyof IRoom["exits"]
    const direction = requestedDirection;
    // Get origin room of user
    const originRoom = await getRoomOfUser(user);
    if (!originRoom) {
        logger.error(`Error in move, couldn't find origin room for user ${user.name}`);
        return;
    }
    // Check if the exit is defined
    const exit = originRoom.exits[direction];
    // logger.debug(
    //   `move command verifying ${JSON.stringify(direction)} exit in originRoom..`
    // );
    if (!exit || !originRoom.exits || !originRoom.exits[direction]) {
        // logger.debug(`no exit!`);
        worldEmitter.emit(`messageFor${user.username}`, makeMessage(`rejection`, `There's no exit in that direction.`));
        return;
    }
    // get destination Room
    const destinationRoom = await new Promise((resolve) => {
        worldEmitter.once(`zoneManagerReturningRoom${originRoom.exits[direction].destinationLocation.inRoom.toString()}`, resolve);
        worldEmitter.emit(`roomRequested`, originRoom.exits[direction].destinationLocation);
    });
    if (!destinationRoom) {
        logger.error(`no room attached to exit ${direction} from ${originRoom.name}!`);
        worldEmitter.emit(`messageFor${user.username}`, makeMessage(`rejection`, `A mysterious force blocks your way.`));
        return;
    }
    // logger.debug(`move command got destination room ${destinationRoom.name}`);
    // Message user's origin room
    worldEmitter.emit(`messageFor${user.username}sRoom`, makeMessage(`userMove`, `${user.name} went ${direction}.`));
    await relocateUser(user, originRoom.exits[direction].destinationLocation);
    // Message user's destination room
    worldEmitter.emit(`messageFor${user.username}sRoom`, makeMessage(`userMove`, `${user.name} arrived.`));
    // Message user
    worldEmitter.emit(`messageFor${user.username}`, makeMessage(`userMove`, `You move ${requestedDirection}.`));
}
export default move;
