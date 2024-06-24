import logger from "./logger.js";
export const formPromptForUserHandler = async (formData, socket) => {
    if (formData.form === 'editUserForm') {
        socket.emit(`openEditUserForm`, formData);
        return;
    }
    if (formData.form === 'createUserForm') {
        socket.emit(`openCreateUserForm`);
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
