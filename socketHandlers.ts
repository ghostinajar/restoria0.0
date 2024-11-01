// socketHandlers
import mongoose from "mongoose";
import logger from "./logger.js";
import { SuggestionType } from "./model/classes/Suggestion.js";
import { IUser } from "./model/classes/User.js";
import IMessage from "./types/Message.js";
import getZoneOfUser from "./util/getZoneofUser.js";
import { purifyAllStringPropsOfObject } from "./util/purify.js";
import { historyStartingNow } from "./model/classes/History.js";
import stats from "./commands/stats.js";

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
};

export async function handleSuggestion(
  suggestionFormData: {
    _id: string;
    suggestionType: SuggestionType;
    body: string;
  },
  user: IUser
) {
  suggestionFormData = purifyAllStringPropsOfObject(suggestionFormData);
  const zone = await getZoneOfUser(user);
  const suggestion = {
    author: user._id,
    refersToId: new mongoose.Types.ObjectId(suggestionFormData._id),
    suggestionType: suggestionFormData.suggestionType,
    body: suggestionFormData.body,
    history: historyStartingNow(),
  };

  switch (suggestionFormData.suggestionType) {
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
