// socketHandlers
import mongoose from "mongoose";
import logger from "./logger.js";
import User from "./model/classes/User.js";
import getZoneOfUser from "./util/getZoneofUser.js";
import purifyDescriptionOfObject, { purifyAllStringPropsOfObject, } from "./util/purify.js";
import { historyStartingNow } from "./model/classes/History.js";
import stats from "./commands/stats.js";
import worldEmitter from "./model/classes/WorldEmitter.js";
import makeMessage from "./util/makeMessage.js";
import catchErrorHandlerForFunction from "./util/catchErrorHandlerForFunction.js";
import editItemBlueprint from "./commands/editItemBlueprint.js";
import editMobBlueprint from "./commands/editMobBlueprint.js";
import editRoom from "./commands/editRoom.js";
import getRoomOfUser from "./util/getRoomOfUser.js";
import createZone from "./commands/createZone.js";
import editZone from "./commands/editZone.js";
import relocateUser from "./util/relocateUser.js";
import createItemBlueprint from "./commands/createItemBlueprint.js";
import createMobBlueprint from "./commands/createMobBlueprint.js";
import createRoom from "./commands/createRoom.js";
import createUser from "./commands/createUser.js";
import editUser from "./commands/editUser.js";
export const formPromptForUserHandler = async (formData, socket) => {
    if (formData.form === "createItemBlueprintForm") {
        socket.emit(`openCreateItemBlueprintForm`, formData);
        return;
    }
    if (formData.form === "createMobBlueprintForm") {
        socket.emit(`opencreateMobBlueprintForm`, formData);
        return;
    }
    if (formData.form === "createRoomForm") {
        socket.emit(`openCreateRoomForm`, formData);
        return;
    }
    if (formData.form === "createUserForm") {
        socket.emit(`openCreateUserForm`);
        return;
    }
    if (formData.form === "createZoneForm") {
        socket.emit(`openCreateZoneForm`);
        return;
    }
    if (formData.form === "editItemBlueprintForm") {
        socket.emit(`openEditItemBlueprintForm`, formData);
        return;
    }
    if (formData.form === "editMobBlueprintForm") {
        socket.emit(`openEditMobBlueprintForm`, formData);
        return;
    }
    if (formData.form === "editRoomForm") {
        socket.emit(`openEditRoomForm`, formData);
        return;
    }
    if (formData.form === "editUserForm") {
        socket.emit(`openEditUserForm`, formData);
        return;
    }
    if (formData.form === "editZoneForm") {
        socket.emit(`openEditZoneForm`, formData);
        return;
    }
    if (formData.form === "eraseItemBlueprintForm") {
        socket.emit(`openEraseItemBlueprintForm`, formData);
        return;
    }
    if (formData.form === "eraseMobBlueprintForm") {
        socket.emit(`openEraseMobBlueprintForm`, formData);
        return;
    }
    if (formData.form === "eraseRoomForm") {
        socket.emit(`openEraseRoomForm`, formData);
        return;
    }
    if (formData.form === "gotoForm") {
        socket.emit(`openGotoForm`, formData);
        return;
    }
    if (formData.form === "suggestForm") {
        socket.emit(`openSuggestForm`, formData);
        return;
    }
    if (formData.form === "suggestionsForm") {
        socket.emit(`openSuggestionsForm`, formData);
        return;
    }
};
export async function handleSuggestion(suggestionFormData, user) {
    suggestionFormData = purifyAllStringPropsOfObject(suggestionFormData);
    const zone = await getZoneOfUser(user);
    if (!zone) {
        throw new Error(`Couldn't get ${user.username}'s zone.`);
    }
    const author = await User.findById(zone.author);
    let authorName = author?.name || "the author";
    if (zone.history.completionStatus === "published") {
        worldEmitter.emit(`messageFor${user.username}`, makeMessage("rejection", `This zone is already published! Contact ${authorName} with your suggestion.`));
        return;
    }
    const suggestion = {
        authorId: user._id,
        authorName: user.name,
        refersToId: new mongoose.Types.ObjectId(suggestionFormData._id),
        refersToObjectType: suggestionFormData.refersToObjectType,
        body: suggestionFormData.body,
        status: "pending",
        history: historyStartingNow(),
    };
    switch (suggestionFormData.refersToObjectType) {
        case "room":
            suggestion.refersToId = user.location.inRoom;
            break;
        case "zone":
            suggestion.refersToId = user.location.inZone;
            break;
        default:
            break;
    }
    zone.suggestions.push(suggestion);
    await zone.save();
    await zone.initRooms();
    stats(user);
}
export const messageArrayForUserHandler = async (messageArray, socket) => {
    for (let message of messageArray) {
        socket.emit(`message`, message);
    }
};
export const messageForUserHandler = async (message, socket) => {
    socket.emit(`message`, message);
};
export const messageForUsersRoomHandler = async (message, socket, user) => {
    // logger.debug(
    //   `socket says ${user.name}'s location is ${JSON.stringify(user.location)}`
    // );
    socket.to(user.location.inRoom.toString()).emit(`message`, message);
};
export const messageForUsersZoneHandler = async (message, socket, user) => {
    socket.to(user.location.inZone.toString()).emit(`message`, message);
};
export const userSubmittedEditItemBlueprintHandler = async (itemId, itemBlueprintData, user) => {
    try {
        purifyDescriptionOfObject(itemBlueprintData);
        await editItemBlueprint(itemId, itemBlueprintData, user);
        stats(user);
    }
    catch (error) {
        catchErrorHandlerForFunction(`userSubmittedEditItemBlueprintHandler`, error);
    }
};
export const userSubmittedEditMobBlueprintHandler = async (mobId, mobBlueprintData, user) => {
    try {
        purifyDescriptionOfObject(mobBlueprintData);
        await editMobBlueprint(mobId, mobBlueprintData, user);
        stats(user);
    }
    catch (error) {
        catchErrorHandlerForFunction(`userSubmittedEditMobBlueprintHandler`, error, user?.name);
    }
};
export const userSubmittedEditRoomHandler = async (roomData, user) => {
    try {
        const room = await getRoomOfUser(user);
        if (!room) {
            throw new Error(`Room not found for user ${user.name}`);
        }
        purifyDescriptionOfObject(roomData);
        await editRoom(room, roomData, user);
        stats(user);
    }
    catch (error) {
        catchErrorHandlerForFunction(`userSubmittedEditRoomHandler`, error, user?.name);
    }
};
export const userSubmittedEditZoneHandler = async (zoneData, user) => {
    try {
        purifyDescriptionOfObject(zoneData);
        await editZone(zoneData, user);
        stats(user);
    }
    catch (error) {
        catchErrorHandlerForFunction(`userSubmittedEditZoneHandler`, error, user?.name);
    }
};
export const userSubmittedEraseItemBlueprintHandler = async (formData, user) => {
    try {
        const zone = await getZoneOfUser(user);
        if (!zone) {
            throw new Error(`Couldn't get ${user.username}'s zone.`);
        }
        await zone.eraseItemBlueprintById(formData._id);
        logger.info(`User ${user.name} erased itemBlueprint ${formData.name}, id: ${formData._id}`);
        let message = makeMessage("success", `You permanently erased the itemBlueprint for ${formData.name}.`);
        worldEmitter.emit(`messageFor${user.username}`, message);
    }
    catch (error) {
        catchErrorHandlerForFunction(`userSubmittedEraseItemBlueprintHandler`, error, user?.name);
    }
};
export const userSubmittedEraseMobBlueprintHandler = async (formData, user) => {
    try {
        const zone = await getZoneOfUser(user);
        if (!zone) {
            throw new Error(`Couldn't get ${user.username}'s zone.`);
        }
        await zone.eraseMobBlueprintById(formData._id);
        logger.info(`User ${user.name} erased mobBlueprint ${formData.name}, id: ${formData._id}`);
        let message = makeMessage("success", `You permanently erased the mobBlueprint for ${formData.name}.`);
        worldEmitter.emit(`messageFor${user.username}`, message);
    }
    catch (error) {
        catchErrorHandlerForFunction(`userSubmittedEraseMobBlueprintHandler`, error, user?.name);
    }
};
export const userSubmittedEraseRoomHandler = async (formData, user) => {
    try {
        const zone = await getZoneOfUser(user);
        if (!zone) {
            throw new Error(`Couldn't get ${user.username}'s zone.`);
        }
        await zone.eraseRoomById(formData._id);
        logger.info(`User ${user.name} erased room ${formData.name}, id: ${formData._id}`);
        let message = makeMessage("success", `You permanently erased the room ${formData.name}.`);
        worldEmitter.emit(`messageFor${user.username}`, message);
    }
    catch (error) {
        catchErrorHandlerForFunction(`userSubmittedEraseRoomHandler`, error, user?.name);
    }
};
export const userSubmittedGotoHandler = async (gotoFormData, user) => {
    try {
        worldEmitter.emit(`messageFor${user.username}sRoom`, makeMessage(`success`, `${user.name} disappears.`));
        worldEmitter.emit(`messageFor${user.username}`, makeMessage(`success`, `You close your eyes for a moment, imagine the location, and appear there.`));
        await relocateUser(user, gotoFormData);
        worldEmitter.emit(`messageFor${user.username}sRoom`, makeMessage(`success`, `${user.name} appears.`));
    }
    catch (error) {
        catchErrorHandlerForFunction(`userSubmittedGotoHandler`, error, user?.name);
    }
};
export const userSubmittedCreateItemBlueprintHandler = async (itemBlueprintData, user) => {
    try {
        purifyDescriptionOfObject(itemBlueprintData);
        await createItemBlueprint(itemBlueprintData, user);
        stats(user);
    }
    catch (error) {
        catchErrorHandlerForFunction(`userSubmittedCreateItemBlueprintHandler`, error, user?.name);
    }
};
export const userSubmittedCreateMobBlueprintHandler = async (mobBlueprintData, user) => {
    try {
        purifyDescriptionOfObject(mobBlueprintData);
        await createMobBlueprint(mobBlueprintData, user);
        stats(user);
    }
    catch (error) {
        catchErrorHandlerForFunction(`userSubmittedCreateMobBlueprintHandler`, error, user?.name);
    }
};
export const userSubmittedCreateRoomHandler = async (roomData, user) => {
    try {
        purifyDescriptionOfObject(roomData);
        await createRoom(roomData, user);
        stats(user);
    }
    catch (error) {
        catchErrorHandlerForFunction(`userSubmittedCreateRoomHandler`, error, user?.name);
    }
};
export const userSubmittedCreateUserHandler = async (userData, user) => {
    try {
        purifyDescriptionOfObject(userData);
        const newUser = await createUser(userData, user);
        stats(user);
    }
    catch (error) {
        catchErrorHandlerForFunction(`userSubmittedCreateUserHandler`, error, user?.name);
    }
};
export const userSubmittedCreateZoneHandler = async (zoneData, user) => {
    try {
        purifyDescriptionOfObject(zoneData);
        await createZone(zoneData, user);
        stats(user);
    }
    catch (error) {
        catchErrorHandlerForFunction(`userSubmittedCreateZoneHandler`, error, user?.name);
    }
};
export const userSubmittedEditUserHandler = async (userDescription, user) => {
    try {
        purifyDescriptionOfObject(userDescription);
        await editUser(user, userDescription);
        stats(user);
    }
    catch (error) {
        catchErrorHandlerForFunction(`userSubmittedEditUserHandler`, error, user?.name);
    }
};
export const userXLeavingGameHandler = async (user, socket) => {
    // logger.debug(
    //   `socket received user${user.name}LeavingGame event. Disconnecting.`
    // );
    socket.emit(`redirectToLogin`, `User ${user.name} left the game.`);
    socket.disconnect;
};
export const userXChangingRoomsHandler = (originRoomId, originZoneId, destinationRoomId, destinationZoneId, socket, user) => {
    // logger.debug(
    //   `userChangingRoomsHandler called with ${originRoomId},${originZoneId},${destinationRoomId},${destinationZoneId}`
    // );
    // logger.debug(
    //   `${user.name}'s socket is in rooms: ${Array.from(socket.rooms)}`
    // );
    // update room chat
    socket.leave(originRoomId);
    socket.join(destinationRoomId);
    // update zone chat
    if (originZoneId !== destinationZoneId) {
        // logger.debug(
        //   `userChangingRoomsHandler changing users's ioZone to ${destinationZoneId}`
        // );
        socket.leave(originZoneId);
        socket.join(destinationZoneId);
    }
    // logger.debug(
    //   `${user.name}'s socket is now in rooms: ${Array.from(socket.rooms)}`
    // );
};
