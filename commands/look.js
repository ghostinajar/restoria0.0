// look
import logger from "../logger.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import makeMessage from "../types/makeMessage.js";
import getRoomOfUser from "../util/getRoomOfUser.js";
function pushTargetEquipped(targetObject, lookArray) {
    lookArray.push(makeMessage(`heading`, `Equipped:`));
    // for every item in target's IEquipped object, push a message with its .name to lookArray
    for (let [key, value] of Object.entries(targetObject.equipped)) {
        if (value &&
            key !== "$__parent" &&
            key !== "$__" &&
            key !== "$isNew" &&
            key !== "$__v" &&
            key !== "$_id" &&
            key !== "_doc") {
            let message = makeMessage(`equippedItemName`, `${key}: ${value.name}`);
            lookArray.push(message);
        }
    }
}
function pushTargetInventory(targetObject, lookArray) {
    lookArray.push(makeMessage(`heading`, `Inventory:`));
    // for every item in target's inventory array, push a message with its .name to lookArray
    if (targetObject.inventory) {
        for (let item of targetObject.inventory) {
            let message = makeMessage(`itemName`, item.name);
            lookArray.push(message);
        }
    }
}
function lookTarget(target, room, user, lookArray) {
    let targetObject;
    // if users names include target
    logger.debug(`Checking users array ${JSON.stringify(room.users.map((user) => user.username))} for ${target}`);
    targetObject = room.users.find((user) => user.username === target);
    if (targetObject) {
        // push a message for the target.name into lookArray
        lookArray.push(makeMessage(`heading`, `Name: ${targetObject.name}`));
        // push a message for the target.description.look into lookArray
        if (targetObject.description.examine) {
            lookArray.push(makeMessage(`userDescription`, `${targetObject.description.examine}`));
        }
        pushTargetEquipped(targetObject, lookArray);
        pushTargetInventory(targetObject, lookArray);
        return;
    }
    // if mobs names includes target
    logger.debug(`Checking mobs array ${JSON.stringify(room.mobs.map((mob) => mob.name))} for ${target}`);
    targetObject = room.mobs.find((mob) => mob.keywords.includes(target));
    if (targetObject) {
        // push a message for the target.name into lookArray
        lookArray.push(makeMessage(`heading`, `Name: ${targetObject.name}`));
        // push a message for the target.description.look into lookArray
        lookArray.push(makeMessage(`mobDescription`, `${targetObject.description.examine}`));
        pushTargetEquipped(targetObject, lookArray);
        pushTargetInventory(targetObject, lookArray);
        return;
    }
    // if inventory names includes target
    logger.debug(`Checking inventory ${JSON.stringify(room.inventory.map((item) => item.name))} array for ${target}`);
    targetObject = room.inventory.find((item) => item.keywords.includes(target));
    if (targetObject) {
        // push a message for the target.name into lookArray
        lookArray.push(makeMessage(`heading`, `Name: ${targetObject.name}`));
        // push a message for the target.description.look into lookArray
        lookArray.push(makeMessage(`itemDescription`, `${targetObject.description.examine}`));
        if (targetObject.itemType === "container" ||
            targetObject.itemType === "liquid_container") {
            pushTargetInventory(targetObject, lookArray);
        }
        return;
    }
    // If no target found, push a message saying target not found
    lookArray.push(makeMessage(`rejected`, `No '${target}' found in the room.`));
}
function lookRoom(room, user, lookArray) {
    //push a message for the room's name into look Array
    let roomNameMessage = makeMessage(`heading`, `${room.name}`);
    lookArray.push(roomNameMessage);
    //push a message for the room's description.look into look Array
    let roomDescriptionMessage = makeMessage(`roomDescription`, `${room.description.look}`);
    lookArray.push(roomDescriptionMessage);
    //push a message for each item's description.look into lookArray
    for (let itemInRoom of room.inventory) {
        const message = makeMessage(`itemIsHere`, `${itemInRoom.description.look}`);
        lookArray.push(message);
    }
    //push a message for each mob's description.look into lookArray
    for (let mobInRoom of room.mobs) {
        const message = makeMessage(`mobIsHere`, `${mobInRoom.description.look}`);
        lookArray.push(message);
    }
    //push a message for each user's name + `is here.` into lookArray
    for (let userInRoom of room.users) {
        const message = makeMessage(`userIsHere`, `${userInRoom.name} is here.`);
        if (userInRoom.name !== user.name)
            lookArray.push(message);
    }
}
async function look(parsedCommand, user) {
    logger.debug(`look command initiated`);
    const room = await getRoomOfUser(user);
    let lookArray = [];
    if (parsedCommand.directObject) {
        logger.debug(`look command targeting ${parsedCommand.directObject}`);
        lookTarget(parsedCommand.directObject.toLowerCase(), room, user, lookArray);
        logger.debug(`lookArray gathered: ${JSON.stringify(lookArray)}`);
        worldEmitter.emit(`messageArrayFor${user.username}`, lookArray);
        return;
    }
    lookRoom(room, user, lookArray);
    logger.debug(`lookArray gathered: ${JSON.stringify(lookArray)}`);
    worldEmitter.emit(`messageArrayFor${user.username}`, lookArray);
}
export default look;
