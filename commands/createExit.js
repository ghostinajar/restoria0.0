// createExit
// allows user to create an exit between two existing rooms
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import getRoomOfUser from "../util/getRoomOfUser.js";
import getZoneOfUser from "../util/getZoneofUser.js";
import getMapCoordsInDirection from "../util/getMapCoordsInDirection.js";
import getRoomInZoneByCoords from "../util/getRoomInZoneByMapCoords.js";
import makeExitToRoomId from "../util/makeExitToRoomId.js";
import makeMessage from "../util/makeMessage.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import getOppositeDirection from "../util/getOppositeDirection.js";
import lookExamine from "./lookExamine.js";
async function createExit(direction, user) {
    try {
        const originRoom = await getRoomOfUser(user);
        if (!originRoom) {
            throw new Error(`Room not found for ${user.name}.`);
        }
        const zone = await getZoneOfUser(user);
        if (!zone) {
            throw new Error(`Room not found for ${user.name}.`);
        }
        if (originRoom.exits[direction]) {
            throw new Error(`create_exit form submitted for an existing exit ${direction} of room ${originRoom._id}`);
        }
        const destinationCoords = getMapCoordsInDirection(direction, originRoom.mapCoords);
        if (!destinationCoords) {
            throw new Error(`couldn't get valid destinationCoords ${direction} of room ${originRoom._id}`);
        }
        const destinationRoom = getRoomInZoneByCoords(destinationCoords, zone);
        if (!destinationRoom) {
            throw new Error(`couldn't get valid destinationRoom ${direction} of room ${originRoom._id}`);
        }
        originRoom.exits[direction] = makeExitToRoomId(destinationRoom._id, zone._id);
        let oppositeDirection = getOppositeDirection(direction);
        if (!oppositeDirection) {
            throw new Error(`couldn't get opposite direction of ${direction}`);
        }
        destinationRoom.exits[oppositeDirection] = makeExitToRoomId(originRoom._id, zone._id);
        await zone.save();
        await zone.initRooms();
        await lookExamine({ commandWord: "look" }, user);
        worldEmitter.emit(`messageFor${user.username}`, makeMessage("success", `You created an exit ${direction}.`));
    }
    catch (error) {
        catchErrorHandlerForFunction(`createExit`, error, user?.name);
    }
}
export default createExit;
