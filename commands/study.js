// study
// shows the user the study description of room or target
import worldEmitter from "../model/classes/WorldEmitter.js";
import getRoomOfUser from "../util/getRoomOfUser.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import selectTargetByOrdinal from "../util/selectTargetByOrdinal.js";
import makeMessage from "../util/makeMessage.js";
import messageMissingTargetToUser from "../util/messageMissingTargetToUser.js";
async function study(parsedCommand, user) {
    try {
        function studyForObject(object) {
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
        const room = await getRoomOfUser(user);
        if (!room) {
            throw new Error(`Room not found for user ${user.name}`);
        }
        let targetKeyword = parsedCommand.directObject;
        // target is missing or room?
        if (!targetKeyword || targetKeyword === "room") {
            studyForObject(room);
            return;
        }
        // target is a user?
        let userObject = room.users.find((user) => user.username === targetKeyword);
        if (userObject) {
            studyForObject(userObject);
            return;
        }
        //target is a mob?
        let targetOrdinal = parsedCommand.directObjectOrdinal || 0;
        let mobObject = selectTargetByOrdinal(targetOrdinal, targetKeyword, room.mobs);
        if (mobObject) {
            studyForObject(mobObject);
            return;
        }
        //target is an item?
        let itemObject = selectTargetByOrdinal(targetOrdinal, targetKeyword, room.inventory);
        if (itemObject) {
            studyForObject(itemObject);
            return;
        }
        messageMissingTargetToUser(user, targetKeyword);
    }
    catch (error) {
        catchErrorHandlerForFunction("study", error, user.name);
    }
}
export default study;
