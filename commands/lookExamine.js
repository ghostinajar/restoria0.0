// lookExamine
// shows the user what's in their room,
// or the description and contents of a target
import worldEmitter from "../model/classes/WorldEmitter.js";
import getRoomOfUser from "../util/getRoomOfUser.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import selectTargetByOrdinal from "../util/selectTargetByOrdinal.js";
import messageMissingTargetToUser from "../util/messageMissingTargetToUser.js";
import makeMessage from "../util/makeMessage.js";
import autoMap from "./autoMap.js";
async function lookExamine(parsedCommand, user) {
    try {
        const room = await getRoomOfUser(user);
        if (!room) {
            throw new Error(`Room not found for user ${user.name}`);
        }
        const targetKeyword = parsedCommand.directObject || "";
        const lookExamineArray = [];
        const lookOrExamine = parsedCommand.commandWord;
        let targetObject;
        let targetOrdinal = parsedCommand.directObjectOrdinal || 0;
        // set targetObject if it's a room (or no target)
        if (!targetKeyword || targetKeyword === "room") {
            targetObject = room;
        }
        if (!targetObject) {
            // set targetObject if it's a user
            let userObject = room.users.find((user) => user.username === targetKeyword);
            if (userObject) {
                targetObject = userObject;
            }
        }
        if (!targetObject) {
            // set targetObject if it's a mob
            let mobObject = selectTargetByOrdinal(targetOrdinal, targetKeyword, room.mobs);
            if (mobObject) {
                targetObject = mobObject;
            }
        }
        if (!targetObject) {
            // set targetObject if it's an item
            let itemObject = selectTargetByOrdinal(targetOrdinal, targetKeyword, room.inventory);
            if (itemObject) {
                targetObject = itemObject;
            }
        }
        // message user target is missing
        if (!targetObject) {
            messageMissingTargetToUser(user, targetKeyword);
            return;
        }
        // pack target name
        let nameText = `Name: ${targetObject.name}`;
        if ("roomType" in targetObject) {
            nameText = targetObject.name;
        }
        lookExamineArray.push(makeMessage(`heading`, nameText));
        // pack target description
        let objectDescription = makeMessage(`description`, `${targetObject.description[lookOrExamine]}`);
        if (user.preferences.autoExamine) {
            objectDescription.content = `${targetObject.description.examine}`;
        }
        if (!objectDescription.content ||
            objectDescription.content === "undefined") {
            objectDescription.content = `This zone's author needs to add a description here.`;
        }
        lookExamineArray.push(objectDescription);
        // pack target equipment
        if ("equipped" in targetObject) {
            pushTargetEquipped(targetObject, lookExamineArray);
        }
        // pack target inventory
        pushTargetInventory(targetObject, lookExamineArray);
        // if target is room, pack mobs
        if ("mobs" in targetObject) {
            for (let mobInRoom of room.mobs) {
                const message = makeMessage(`mobIsHere`, `${mobInRoom.description.look}`);
                lookExamineArray.push(message);
            }
        }
        // if target is room, pack users
        if ("users" in targetObject) {
            for (let userInRoom of room.users) {
                const message = makeMessage(`userIsHere`, `${userInRoom.name} is here.`);
                if (userInRoom.name !== user.name)
                    lookExamineArray.push(message);
            }
        }
        worldEmitter.emit(`messageArrayFor${user.username}`, lookExamineArray);
        await autoMap(user);
    }
    catch (error) {
        catchErrorHandlerForFunction("lookExamine", error, user.name);
    }
}
function pushTargetEquipped(targetObject, lookExamineArray) {
    try {
        lookExamineArray.push(makeMessage(`heading`, `Equipped:`));
        // for every item in target's IEquipped object, push a message with its .name to lookExamineArray
        for (let [key, value] of Object.entries(targetObject.equipped)) {
            if (value &&
                key !== "$__parent" &&
                key !== "$__" &&
                key !== "$isNew" &&
                key !== "$__v" &&
                key !== "$_id" &&
                key !== "_doc") {
                let message = makeMessage(`equippedItemName`, `${key}: ${value.name}`);
                lookExamineArray.push(message);
            }
        }
    }
    catch (error) {
        catchErrorHandlerForFunction("pushTargetEquipped", error);
    }
}
function pushTargetInventory(targetObject, lookExamineArray) {
    try {
        if (!("roomType" in targetObject)) {
            lookExamineArray.push(makeMessage(`heading`, `Inventory:`));
        }
        if (targetObject.inventory) {
            if ("roomType" in targetObject) {
                // room inventory (look descriptions)
                for (let itemInRoom of targetObject.inventory) {
                    const message = makeMessage(`itemIsHere`, `${itemInRoom.description.look}`);
                    lookExamineArray.push(message);
                }
            }
            else {
                // user, mob, or item inventory (names only)
                for (let item of targetObject.inventory) {
                    let message = makeMessage(`itemName`, item.name);
                    lookExamineArray.push(message);
                }
            }
        }
    }
    catch (error) {
        catchErrorHandlerForFunction("pushTargetInventory", error);
    }
}
export default lookExamine;
