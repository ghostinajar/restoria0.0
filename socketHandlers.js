import logger from "./logger.js";
import getZoneOfUser from "./util/getZoneofUser.js";
import worldEmitter from "./model/classes/WorldEmitter.js";
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
        socket.emit(`openEditMobBlueprintForm`, formData.editMobBlueprintFormData);
        return;
    }
    if (formData.form === "editItemSelect") {
        socket.emit(`openEditItemSelect`, formData.itemBlueprintList);
        return;
    }
    if (formData.form === "editMobSelect") {
        socket.emit(`openEditMobSelect`, formData.mobBlueprintList);
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
};
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
export const userSelectedItemEditHandler = async (user, itemId) => {
    const zone = await getZoneOfUser(user);
    logger.debug(`userSelectedItemEditHandler found zone ${zone.name}`);
    const itemBlueprint = zone.itemBlueprints.find((blueprint) => blueprint._id.toString() === itemId.toString());
    if (!itemBlueprint) {
        logger.error(`userSelectedItemEditHandler couldn't find blueprint for ${itemId}`);
        return;
    }
    logger.debug(`userSelectedItemEditHandler found blueprint for ${itemBlueprint.name}`);
    const editItemBlueprintFormData = {
        _id: itemBlueprint?._id,
        name: itemBlueprint?.name,
        itemType: itemBlueprint?.itemType,
        keywords: itemBlueprint?.keywords,
        description: itemBlueprint?.description,
        price: itemBlueprint?.price,
        minimumLevel: itemBlueprint?.minimumLevel,
        isContainer: itemBlueprint?.tags.container,
    };
    logger.debug(`userSelectedItemEditHandler sending formData ${JSON.stringify(editItemBlueprintFormData)}`);
    worldEmitter.emit(`formPromptFor${user.username}`, {
        form: `editItemBlueprintForm`,
        editItemBlueprintFormData,
    });
};
export const userSelectedMobEditHandler = async (user, mobId) => {
    const zone = await getZoneOfUser(user);
    // logger.debug(`userSelectedMobEditHandler found zone ${zone.name}`)
    const mobBlueprint = zone.mobBlueprints.find((blueprint) => blueprint._id.toString() === mobId.toString());
    if (!mobBlueprint) {
        logger.error(`userSelectedMobEditHandler couldn't find blueprint for ${mobId}`);
        return;
    }
    // logger.debug(`userSelectedMobEditHandler found blueprint for ${mobBlueprint.name}`)
    const editMobBlueprintFormData = {
        _id: mobBlueprint?._id,
        name: mobBlueprint?.name,
        pronouns: mobBlueprint?.pronouns,
        level: mobBlueprint?.level,
        job: mobBlueprint?.job,
        statBlock: mobBlueprint?.statBlock,
        keywords: mobBlueprint?.keywords,
        isUnique: mobBlueprint?.isUnique,
        isMount: mobBlueprint?.isMount,
        isAggressive: mobBlueprint?.isAggressive,
        description: mobBlueprint?.description,
    };
    // logger.debug(`userSelectedMobEditHandler sending formData ${JSON.stringify(editMobBlueprintFormData)}`);
    worldEmitter.emit(`formPromptFor${user.username}`, {
        form: `editMobBlueprintForm`,
        editMobBlueprintFormData,
    });
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
    socket.leave(originRoomId);
    socket.join(destinationRoomId);
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
