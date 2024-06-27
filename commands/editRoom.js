import logger from "../logger.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import makeMessage from "../types/makeMessage.js";
import truncateDescription from "../util/truncateDescription.js";
async function editRoom(room, roomData, user) {
    let changed = false;
    logger.debug(`editRoom submitted by user ${user.name} for room: ${JSON.stringify(room.name)}`);
    if (!room || !roomData || !user) {
        worldEmitter.emit(`messageFor${user.username}`, makeMessage(`rejected`, `Oops! Can't seem to edit this room.`));
        return;
    }
    const newRoomDescription = {
        look: roomData.look,
        examine: roomData.examine,
        study: roomData.study,
        research: roomData.research,
    };
    truncateDescription(newRoomDescription, user);
    //prepare to compare new to previous data
    let newRoomFlags = {
        isDark: roomData.isDark,
        isIndoors: roomData.isIndoors,
        isOnWater: roomData.isOnWater,
        isUnderwater: roomData.isUnderwater,
    };
    let previousRoomFlags = {
        isDark: room.isDark,
        isIndoors: room.isIndoors,
        isOnWater: room.isOnWater,
        isUnderwater: room.isUnderwater,
    };
    //compare
    if (newRoomDescription !== room.description) {
        room.description = newRoomDescription;
        changed = true;
    }
    if (newRoomFlags !== previousRoomFlags) {
        room.isDark = roomData.isDark;
        room.isIndoors = roomData.isIndoors;
        room.isOnWater = roomData.isOnWater;
        room.isUnderwater = roomData.isUnderwater;
        changed = true;
    }
    if (changed) {
        room.history.modifiedDate = new Date();
        const zone = await new Promise((resolve) => {
            worldEmitter.once(`zone${user.location.inZone.toString()}Loaded`, resolve);
            worldEmitter.emit(`zoneRequested`, user.location.inZone);
        });
        if (!zone) {
            logger.error(`editRoom couldn't find zone to save for user ${user.username}'s location.}`);
            return;
        }
        //TODO get zone of room
        await zone.save();
        worldEmitter.emit(`messageFor${user.username}`, makeMessage(`success`, `Room updated!`));
        logger.debug(`editRoom updated room ${room.name}: ${JSON.stringify(room.description)} 
      isDark: ${room.isDark} 
      isIndoors: ${room.isIndoors} 
      isOnWater: ${room.isOnWater} 
      isUnderwater: ${room.isUnderwater}`);
        return;
    }
    else {
        worldEmitter.emit(`messageFor${user.username}`, makeMessage(`rejected`, `No change saved to room.`));
        return;
    }
}
export default editRoom;
