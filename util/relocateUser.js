import exits from "../commands/exits.js";
import lookExamine from "../commands/lookExamine.js";
import logger from "../logger.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
import makeMessage from "./makeMessage.js";
async function relocateUser(user, destinationLocation) {
    try {
        // get destination room from zoneManager
        const destinationRoom = await new Promise((resolve) => {
            worldEmitter.once(`zoneManagerReturningRoom${destinationLocation.inRoom.toString()}`, resolve);
            worldEmitter.emit(`roomRequested`, destinationLocation);
        });
        if (!destinationRoom) {
            logger.error(`relocateUser failed: ${user.name} couldn't move to location ${JSON.stringify(destinationLocation)}}`);
            worldEmitter.emit(`messageFor${user.username}`, makeMessage(`rejection`, `A mysterious force blocks the way. You stay where you are.`));
            return;
        }
        // fail if destination is full
        if (destinationRoom.users.length >= destinationRoom.playerCap) {
            worldEmitter.emit(`messageFor${user.username}`, makeMessage(`rejection`, `It's too crowded to move that way. You stay where you are.`));
            return;
        }
        // get origin room from zoneManager
        const originRoom = await new Promise((resolve) => {
            worldEmitter.once(`zoneManagerReturningRoom${user.location.inRoom.toString()}`, resolve);
            worldEmitter.emit(`roomRequested`, user.location);
        });
        if (!originRoom) {
            logger.error(`relocateUser failed: ${user.name} has invalid originRoom location ${JSON.stringify(originRoom)}. Reseting location...}`);
            worldEmitter.emit(`placeUserRequest`, user);
            worldEmitter.emit(`messageFor${user.username}`, makeMessage(`rejection`, `Something went wrong. A mysterious force returns you to Restoria City.`));
            return;
        }
        originRoom.removeEntityFrom("users", user);
        destinationRoom.addEntityTo("users", user);
        user.location = destinationLocation;
        //notify socket to update chats
        worldEmitter.emit(`user${user.username}ChangingRooms`, originRoom._id.toString(), originRoom.fromZoneId.toString(), destinationRoom._id.toString(), destinationRoom.fromZoneId.toString());
        await lookExamine({ commandWord: `look` }, user);
        await exits(user);
    }
    catch (error) {
        catchErrorHandlerForFunction(`relocateUser`, error, user?.name);
    }
}
export default relocateUser;
