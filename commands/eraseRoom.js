// eraseRoom
// handles a user submitting erase_room form
import logger from "../logger.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import getZoneOfUser from "../util/getZoneofUser.js";
import messageToUsername from "../util/messageToUsername.js";
import lookExamine from "./lookExamine.js";
async function eraseRoom(formData, user) {
    try {
        const zone = await getZoneOfUser(user);
        if (!zone) {
            throw new Error(`Couldn't get ${user.username}'s zone.`);
        }
        const room = zone.rooms.find((room) => room._id.toString() === formData._id.toString());
        if (!room) {
            throw new Error(`Couldn't find room with id ${formData._id}.`);
        }
        // remove the map tile from users's map
        const zoneFloorName = `${zone.name} Floor ${room.mapCoords[2]}`;
        const roomCoords = room.mapCoords;
        worldEmitter.emit(`eraseMapTileFor${user.username}`, zoneFloorName, roomCoords);
        //erase the room from the zone
        await zone.eraseRoomById(formData._id);
        logger.info(`User ${user.name} erased room ${formData.name}, id: ${formData._id}`);
        await lookExamine({ commandWord: "look" }, user);
        messageToUsername(user.username, `You permanently erased the room ${formData.name}.`, "success");
    }
    catch (error) {
        catchErrorHandlerForFunction(`eraseRoom`, error, user?.name);
    }
}
export default eraseRoom;
