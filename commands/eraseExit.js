// eraseExit
// sets an exit (and its corresponding exit in other room) to null
import { directions } from "../constants/DIRECTIONS.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import getRoomOfUser from "../util/getRoomOfUser.js";
import getZoneOfUser from "../util/getZoneofUser.js";
import makeMessage from "../util/makeMessage.js";
async function eraseExit(direction, user) {
    try {
        const originRoom = await getRoomOfUser(user);
        if (!originRoom) {
            throw new Error(`Room not found for user ${user.name}`);
        }
        if (!originRoom.exits[direction]) {
            throw new Error(`exit ${direction} not found in room ${originRoom._id}`);
        }
        const zone = await getZoneOfUser(user);
        if (!zone) {
            throw new Error(`Zone not found for user ${user.name}`);
        }
        const destinationRoom = zone.rooms.find((room) => room._id.toString() ===
            originRoom.exits[direction]?.destinationLocation.inRoom.toString());
        if (!destinationRoom) {
            throw new Error(`room not found to the ${direction} of room ${originRoom._id}`);
        }
        let oppositeDirection = "";
        switch (direction) {
            case "north":
                oppositeDirection = "south";
                break;
            case "east":
                oppositeDirection = "west";
                break;
            case "south":
                oppositeDirection = "north";
                break;
            case "west":
                oppositeDirection = "east";
                break;
            case "up":
                oppositeDirection = "down";
                break;
            case "down":
                oppositeDirection = "up";
                break;
            default:
                break;
        }
        originRoom.exits[direction] = null;
        if (directions.includes(oppositeDirection)) {
            destinationRoom.exits[oppositeDirection] = null;
        }
        await zone.save();
        await zone.initRooms();
        worldEmitter.emit(`messageFor${user.username}`, makeMessage("success", `You erased the exit to the ${direction}.`));
    }
    catch (error) {
        catchErrorHandlerForFunction(`userSubmittedEraseExitHandler`, error, user?.name);
    }
}
export default eraseExit;
