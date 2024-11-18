// socketHandlers
import mongoose from "mongoose";
import logger from "./logger.js";
import {
  refersToObjectType,
  suggestionStatusType,
} from "./model/classes/Suggestion.js";
import User, { IUser } from "./model/classes/User.js";
import IMessage from "./types/Message.js";
import getZoneOfUser from "./util/getZoneofUser.js";
import purifyDescriptionOfObject, {
  purifyAllStringPropsOfObject,
} from "./util/purify.js";
import { historyStartingNow } from "./model/classes/History.js";
import stats from "./commands/stats.js";
import worldEmitter from "./model/classes/WorldEmitter.js";
import makeMessage from "./util/makeMessage.js";
import catchErrorHandlerForFunction from "./util/catchErrorHandlerForFunction.js";
import editItemBlueprint, {
  IEditItemBlueprintFormData,
} from "./commands/editItemBlueprint.js";
import editMobBlueprint, {
  IEditMobFormData,
} from "./commands/editMobBlueprint.js";
import editRoom, { IEditRoomFormData } from "./commands/editRoom.js";
import getRoomOfUser from "./util/getRoomOfUser.js";
import { IZoneData } from "./commands/createZone.js";
import editZone from "./commands/editZone.js";

export const formPromptForUserHandler = async (formData: any, socket: any) => {
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

export async function handleSuggestion(
  suggestionFormData: {
    _id: string;
    refersToObjectType: refersToObjectType;
    body: string;
  },
  user: IUser
) {
  suggestionFormData = purifyAllStringPropsOfObject(suggestionFormData);
  const zone = await getZoneOfUser(user);
  if (!zone) {
    throw new Error(`Couldn't get ${user.username}'s zone.`);
  }
  const author = await User.findById(zone.author);
  let authorName = author?.name || "the author";

  if (zone.history.completionStatus === "published") {
    worldEmitter.emit(
      `messageFor${user.username}`,
      makeMessage(
        "rejection",
        `This zone is already published! Contact ${authorName} with your suggestion.`
      )
    );
    return;
  }

  const suggestion = {
    authorId: user._id,
    authorName: user.name,
    refersToId: new mongoose.Types.ObjectId(suggestionFormData._id),
    refersToObjectType: suggestionFormData.refersToObjectType,
    body: suggestionFormData.body,
    status: "pending" as suggestionStatusType,
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
  // logger.debug(
  //   `socket says ${user.name}'s location is ${JSON.stringify(user.location)}`
  // );
  socket.to(user.location.inRoom.toString()).emit(`message`, message);
};

export const messageForUsersZoneHandler = async (
  message: IMessage,
  socket: any,
  user: IUser
) => {
  socket.to(user.location.inZone.toString()).emit(`message`, message);
};

export const userSubmittedEditItemBlueprintHandler = async (
  itemId: mongoose.Types.ObjectId,
  itemBlueprintData: IEditItemBlueprintFormData,
  user: IUser
) => {
  try {
    purifyDescriptionOfObject(itemBlueprintData);
    await editItemBlueprint(itemId, itemBlueprintData, user);
    stats(user);
  } catch (error: unknown) {
    catchErrorHandlerForFunction(
      `userSubmittedEditItemBlueprintHandler`,
      error
    );
  }
};

export const userSubmittedEditMobBlueprintHandler = async (
  mobId: mongoose.Types.ObjectId,
  mobBlueprintData: IEditMobFormData,
  user: IUser
) => {
  try {
    purifyDescriptionOfObject(mobBlueprintData);
    await editMobBlueprint(mobId, mobBlueprintData, user);
    stats(user);
  } catch (error: unknown) {
    catchErrorHandlerForFunction(
      `userSubmittedEditMobBlueprintHandler`,
      error,
      user?.name
    );
  }
};

export const userSubmittedEditRoomHandler = async (
  roomData: IEditRoomFormData,
  user: IUser
) => {
  try {
    const room = await getRoomOfUser(user);
    if (!room) {
      throw new Error(`Room not found for user ${user.name}`);
    }
    purifyDescriptionOfObject(roomData);
    await editRoom(room, roomData, user);
    stats(user);
  } catch (error: unknown) {
    catchErrorHandlerForFunction(
      `userSubmittedEditRoomHandler`,
      error,
      user?.name
    );
  }
};

export const userSubmittedEditZoneHandler = async (
  zoneData: IZoneData,
  user: IUser
) => {
  try {
    purifyDescriptionOfObject(zoneData);
    await editZone(zoneData, user);
    stats(user);
  } catch (error: unknown) {
    catchErrorHandlerForFunction(
      `userSubmittedEditZoneHandler`,
      error,
      user?.name
    );
  }
};

export const userSubmittedEraseItemBlueprintHandler = async (
  formData: { _id: string; name: string },
  user: IUser
) => {
  try {
    const zone = await getZoneOfUser(user);
    if (!zone) {
      throw new Error(`Couldn't get ${user.username}'s zone.`);
    }
    await zone.eraseItemBlueprintById(formData._id);
    logger.info(
      `User ${user.name} erased itemBlueprint ${formData.name}, id: ${formData._id}`
    );
    let message = makeMessage(
      "success",
      `You permanently erased the itemBlueprint for ${formData.name}.`
    );
    worldEmitter.emit(`messageFor${user.username}`, message);
  } catch (error: unknown) {
    catchErrorHandlerForFunction(
      `userSubmittedEraseItemBlueprintHandler`,
      error,
      user?.name
    );
  }
};

export const userSubmittedEraseMobBlueprintHandler = async (
  formData: { _id: string; name: string },
  user: IUser
) => {
  try {
    const zone = await getZoneOfUser(user);
    if (!zone) {
      throw new Error(`Couldn't get ${user.username}'s zone.`);
    }
    await zone.eraseMobBlueprintById(formData._id);
    logger.info(
      `User ${user.name} erased mobBlueprint ${formData.name}, id: ${formData._id}`
    );
    let message = makeMessage(
      "success",
      `You permanently erased the mobBlueprint for ${formData.name}.`
    );
    worldEmitter.emit(`messageFor${user.username}`, message);
  } catch (error: unknown) {
    catchErrorHandlerForFunction(
      `userSubmittedEraseMobBlueprintHandler`,
      error,
      user?.name
    );
  }
};

export const userSubmittedEraseRoomHandler = async (
  formData: {
    _id: string;
    name: string;
  },
  user: IUser
) => {
  try {
    const zone = await getZoneOfUser(user);
    if (!zone) {
      throw new Error(`Couldn't get ${user.username}'s zone.`);
    }
    await zone.eraseRoomById(formData._id);
    logger.info(
      `User ${user.name} erased room ${formData.name}, id: ${formData._id}`
    );
    let message = makeMessage(
      "success",
      `You permanently erased the room ${formData.name}.`
    );
    worldEmitter.emit(`messageFor${user.username}`, message);
  } catch (error: unknown) {
    catchErrorHandlerForFunction(
      `userSubmittedEraseRoomHandler`,
      error,
      user?.name
    );
  }
};

export const userXLeavingGameHandler = async (user: IUser, socket: any) => {
  // logger.debug(
  //   `socket received user${user.name}LeavingGame event. Disconnecting.`
  // );
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
