import mongoose from "mongoose";
import logger from "./logger.js";
import { IUser } from "./model/classes/User.js";
import IMessage from "./types/Message.js";
import getZoneOfUser from "./util/getZoneofUser.js";
import worldEmitter from "./model/classes/WorldEmitter.js";
import { IMobBlueprint } from "./model/classes/MobBlueprint.js";

export const formPromptForUserHandler = async (
  formData : any,
  socket : any,
) => {
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

export const userSelectedMobEditHandler = async (user: IUser, mobId : mongoose.Types.ObjectId | string) => {
  const zone = await getZoneOfUser(user);
  logger.debug(`userSelectedMobEditHandler found zone ${zone.name}`)
  const mobBlueprint: IMobBlueprint | undefined = zone.mobBlueprints.find(blueprint => blueprint._id.toString() === mobId.toString());
  if (!mobBlueprint) {
    logger.error(`userSelectedMobEditHandler couldn't find blueprint for ${mobId}`);
    return;
  }
  logger.debug(`userSelectedMobEditHandler found blueprint for ${mobBlueprint.name}`)
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
  worldEmitter.emit(`formPromptFor${user.username}`, {form: `editMobBlueprintForm`, editMobBlueprintFormData});
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
