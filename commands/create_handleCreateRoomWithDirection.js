// create_handleCreateRoomWithDirection
// utility for create command, handles "CREATE ROOM DIRECTION ?NAME"
// (create the room directly when a user has included a direction and optional room name in the command)
import { directions, directionsAbbrev } from "../constants/DIRECTIONS.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import messageToUsername from "../util/messageToUsername.js";
import createRoom from "./createRoom.js";
async function create_handleCreateRoomWithDirection(direction, user, roomName) {
    try {
        // validate parameters, then call createRoom to create the room directly
        if (!direction) {
            throw new Error("Direction missing from command.");
        }
        if (!user) {
            throw new Error("User missing from command.");
        }
        // reject invalid direction parameter (must be "north" or "n", etc)
        if (!directions.includes(direction.toLowerCase()) &&
            !directionsAbbrev.includes(direction.toLowerCase())) {
            messageToUsername(user.username, `Invalid direction. Valid directions are: ${directions.join(", ")} (or ${directionsAbbrev.join(", ")}).`);
            return;
        }
        // if direction is abbreviated, convert to full direction
        const fullDirection = directions.find((dir => dir.startsWith(direction.toLowerCase()))) || direction.toLowerCase();
        if (!fullDirection) {
            throw new Error("Invalid fullDirection.");
        }
        const roomData = {
            name: roomName || `This zone's author needs to name this room.`,
            direction: fullDirection,
            description: {
                look: `This zone's author needs to write a LOOK description here.`,
                examine: `This zone's author needs to write an EXAMINE description here.`,
            },
        };
        // call createRoom to create the room directly
        const room = await createRoom(roomData, user);
    }
    catch (error) {
        catchErrorHandlerForFunction(`create_handleCreateRoomWithDirection`, error, user?.name);
    }
}
export default create_handleCreateRoomWithDirection;
