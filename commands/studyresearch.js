// studyresearch
// shows the user the study or research description of room or target
import worldEmitter from "../model/classes/WorldEmitter.js";
import getRoomOfUser from "../util/getRoomOfUser.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import selectTargetByOrdinal from "../util/selectTargetByOrdinal.js";
import makeMessage from "../util/makeMessage.js";
import messageMissingTargetToUser from "../util/messageMissingTargetToUser.js";
async function studyresearch(parsedCommand, user) {
    try {
        function studyresearchForObject(object, research) {
            if (research) {
                if (object.description.research) {
                    let messageArray = [];
                    messageArray.push(makeMessage(`heading`, object.name));
                    messageArray.push(makeMessage(`description`, object.description.research));
                    worldEmitter.emit(`messageArrayFor${user.username}`, messageArray);
                }
                else {
                    worldEmitter.emit(`messageFor${user.username}`, makeMessage(`failure`, `There's not much to research about that ${targetKeyword}. Try EXAMINE ${targetKeyword?.toUpperCase()} instead.`));
                }
            }
            else {
                if (object.description.study) {
                    let messageArray = [];
                    messageArray.push(makeMessage(`heading`, object.name));
                    messageArray.push(makeMessage(`description`, object.description.study));
                    worldEmitter.emit(`messageArrayFor${user.username}`, messageArray);
                }
                else {
                    worldEmitter.emit(`messageFor${user.username}`, makeMessage(`failure`, `There's not much to study about that ${targetKeyword}. Try EXAMINE ${targetKeyword?.toUpperCase()} instead.`));
                }
            }
        }
        const room = await getRoomOfUser(user);
        if (!room) {
            throw new Error(`Room not found for user ${user.name}`);
        }
        let targetKeyword = parsedCommand.directObject;
        let research = false;
        if (parsedCommand.commandWord === "research") {
            research = true;
        }
        // target is missing or room?
        if (!targetKeyword || targetKeyword === "room") {
            studyresearchForObject(room, research);
            return;
        }
        // target is a user?
        let userObject = room.users.find((user) => user.username === targetKeyword);
        if (userObject) {
            studyresearchForObject(userObject, research);
            return;
        }
        //target is a mob?
        let targetOrdinal = parsedCommand.directObjectOrdinal || 0;
        let mobObject = selectTargetByOrdinal(targetOrdinal, targetKeyword, room.mobs);
        if (mobObject) {
            studyresearchForObject(mobObject, research);
            return;
        }
        //target is an item?
        let itemObject = selectTargetByOrdinal(targetOrdinal, targetKeyword, room.inventory);
        if (itemObject) {
            studyresearchForObject(itemObject, research);
            return;
        }
        messageMissingTargetToUser(user, targetKeyword);
    }
    catch (error) {
        catchErrorHandlerForFunction("studyresearch", error, user.name);
    }
}
export default studyresearch;
