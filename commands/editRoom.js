// editRoom
// allows user to edit details of a room
import mongoose from "mongoose";
import worldEmitter from "../model/classes/WorldEmitter.js";
import makeMessage from "../util/makeMessage.js";
import getZoneOfUser from "../util/getZoneofUser.js";
import truncateDescription from "../util/truncateDescription.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
async function editRoom(room, roomData, user) {
    try {
        if (!room)
            throw new Error("Missing room");
        if (!roomData)
            throw new Error("Missing roomData");
        if (!user)
            throw new Error("Missing user");
        const newRoomDescription = {
            examine: roomData.description.examine,
            study: roomData.description.study,
            research: roomData.description.research,
        };
        truncateDescription(newRoomDescription, user);
        room.history.modifiedDate = new Date();
        const zone = await getZoneOfUser(user);
        if (!zone) {
            throw new Error(`couldn't find zone for user ${user.username}'s location.}`);
        }
        room.name = roomData.name;
        room.description = newRoomDescription;
        room.isDark = roomData.isDark;
        room.isIndoors = roomData.isIndoors;
        room.isOnWater = roomData.isOnWater;
        room.isUnderwater = roomData.isUnderwater;
        room.noMounts = roomData.noMounts;
        room.noMobs = roomData.noMobs;
        room.noMagic = roomData.noMagic;
        room.noCombat = roomData.noCombat;
        room.playerCap = roomData.playerCap;
        room.mobCap = roomData.mobCap;
        //clear room.mobNodes and replace with processed roomData.mobNodes
        room.mobNodes = [];
        roomData.mobNodes.forEach((node) => {
            room.mobNodes.push({
                _id: new mongoose.Types.ObjectId(),
                loadsBlueprintId: new mongoose.Types.ObjectId(node.loadsBlueprintId),
                fromZoneId: zone._id,
            });
        });
        //clear room.itemNodes and replace with processed roomData.itemNodes
        room.itemNodes = [];
        roomData.itemNodes.forEach((node) => {
            room.itemNodes.push({
                _id: new mongoose.Types.ObjectId(),
                loadsBlueprintId: new mongoose.Types.ObjectId(node.loadsBlueprintId),
                fromZoneId: zone._id,
            });
        });
        room.exits = roomData.exits;
        await zone.save();
        await zone.initRooms();
        worldEmitter.emit(`messageFor${user.username}`, makeMessage(`success`, `Room updated!`));
    }
    catch (error) {
        catchErrorHandlerForFunction("editRoom", error, user.name);
    }
}
export default editRoom;
