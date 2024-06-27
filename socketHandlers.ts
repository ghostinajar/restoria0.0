import logger from "./logger.js";
import { IUser } from "./model/classes/User.js";
import IMessage from "./types/Message.js";

export const formPromptForUserHandler = async (
  formData : any,
  socket : any,
) => {
  if (formData.form === 'createRoomForm') {
    socket.emit(`openCreateRoomForm`, formData);
    return;
  }
  if (formData.form === 'editUserForm') {
    socket.emit(`openEditUserForm`, formData);
    return;
  }
  if (formData.form === 'editRoomForm') {
    socket.emit(`openEditRoomForm`, formData);
    return;
  }
  if (formData.form === 'createUserForm') {
    socket.emit(`openCreateUserForm`);
    return;
  }
}

export const messageArrayForUserHandler = async (
  messageArray: Array<IMessage>,
  socket: any
) => {
  for (let message of messageArray) {
    socket.emit(`message`, message);
  }
};

export const messageForUserHandler = async (message: IMessage, socket: any) => {
  socket.emit(`message`, message);
};

export const messageForUsersRoomHandler = async (
  message: IMessage,
  socket: any,
  user: IUser
) => {
  logger.debug(
    `socket says ${user.name}'s location is ${JSON.stringify(user.location)}`
  );
  socket.to(user.location.inRoom.toString()).emit(`message`, message);
};

export const messageForUsersZoneHandler = async (
  message: IMessage,
  socket: any,
  user: IUser
) => {
  socket.to(user.location.inZone.toString()).emit(`message`, message);
};

export const userXLeavingGameHandler = async (user: IUser, socket: any) => {
  logger.debug(
    `socket received user${user.name}LeavingGame event. Disconnecting.`
  );
  socket.emit(`redirectToLogin`, `User ${user.name} left the game.`);
  socket.disconnect;
};

export const userXChangingRoomsHandler = (
  originRoomId: string,
  originZoneId: string,
  destinationRoomId: string,
  destinationZoneId: string,
  socket: any,
  user: IUser
) => {
  logger.debug(
    `userChangingRoomsHandler called with ${originRoomId},${originZoneId},${destinationRoomId},${destinationZoneId}`
  );
  logger.debug(
    `${user.name}'s socket is in rooms: ${Array.from(socket.rooms)}`
  );
  socket.leave(originRoomId);
  socket.join(destinationRoomId);
  if (originZoneId !== destinationZoneId) {
    logger.debug(
      `userChangingRoomsHandler changing users's ioZone to ${destinationZoneId}`
    );
    socket.leave(originZoneId);
    socket.join(destinationZoneId);
  }
  logger.debug(
    `${user.name}'s socket is now in rooms: ${Array.from(socket.rooms)}`
  );
};
