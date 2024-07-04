import logger from "./logger.js";
import getZoneOfUser from "./util/getZoneofUser.js";
import worldEmitter from "./model/classes/WorldEmitter.js";
export const formPromptForUserHandler = async (formData, socket) => {
    if (formData.form === 'createMobForm') {
        socket.emit(`openCreateMobForm`, formData);
        return;
    }
    if (formData.form === 'createRoomForm') {
        socket.emit(`openCreateRoomForm`, formData);
        return;
    }
    if (formData.form === 'createUserForm') {
        socket.emit(`openCreateUserForm`);
        return;
    }
    if (formData.form === 'editMobBlueprintForm') {
        socket.emit(`openEditMobBlueprintForm`, formData.editMobBlueprintFormData);
        return;
    }
    if (formData.form === 'editMobSelect') {
        socket.emit(`openEditMobSelect`, formData.list);
        return;
    }
    if (formData.form === 'editRoomForm') {
        socket.emit(`openEditRoomForm`, formData);
        return;
    }
    if (formData.form === 'editUserForm') {
        socket.emit(`openEditUserForm`, formData);
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
    logger.debug(`socket says ${user.name}'s location is ${JSON.stringify(user.location)}`);
    socket.to(user.location.inRoom.toString()).emit(`message`, message);
};
export const messageForUsersZoneHandler = async (message, socket, user) => {
    socket.to(user.location.inZone.toString()).emit(`message`, message);
};
export const userSelectedMobEditHandler = async (user, mobId) => {
    const zone = await getZoneOfUser(user);
    logger.debug(`userSelectedMobEditHandler found zone ${zone.name}`);
    const mobBlueprint = zone.mobBlueprints.find(blueprint => blueprint._id.toString() === mobId.toString());
    if (!mobBlueprint) {
        logger.error(`userSelectedMobEditHandler couldn't find blueprint for ${mobId}`);
        return;
    }
    logger.debug(`userSelectedMobEditHandler found blueprint for ${mobBlueprint.name}`);
    const editMobBlueprintFormData = {
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
    logger.debug(`userSelectedMobEditHandler sending formData ${JSON.stringify(editMobBlueprintFormData)}`);
    worldEmitter.emit(`formPromptFor${user.username}`, { form: `editMobBlueprintForm`, editMobBlueprintFormData });
};
export const userXLeavingGameHandler = async (user, socket) => {
    logger.debug(`socket received user${user.name}LeavingGame event. Disconnecting.`);
    socket.emit(`redirectToLogin`, `User ${user.name} left the game.`);
    socket.disconnect;
};
export const userXChangingRoomsHandler = (originRoomId, originZoneId, destinationRoomId, destinationZoneId, socket, user) => {
    logger.debug(`userChangingRoomsHandler called with ${originRoomId},${originZoneId},${destinationRoomId},${destinationZoneId}`);
    logger.debug(`${user.name}'s socket is in rooms: ${Array.from(socket.rooms)}`);
    socket.leave(originRoomId);
    socket.join(destinationRoomId);
    if (originZoneId !== destinationZoneId) {
        logger.debug(`userChangingRoomsHandler changing users's ioZone to ${destinationZoneId}`);
        socket.leave(originZoneId);
        socket.join(destinationZoneId);
    }
    logger.debug(`${user.name}'s socket is now in rooms: ${Array.from(socket.rooms)}`);
};
