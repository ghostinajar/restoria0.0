// socketHandlers
import mongoose from "mongoose";
import logger from "./logger.js";
import {
  ISuggestion,
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
import createZone, { IZoneData } from "./commands/createZone.js";
import editZone from "./commands/editZone.js";
import { ILocation } from "./model/classes/Location.js";
import relocateUser from "./util/relocateUser.js";
import createItemBlueprint, {
  ICreateItemBlueprintFormData,
} from "./commands/createItemBlueprint.js";
import createMobBlueprint, {
  ICreateMobFormData,
} from "./commands/createMobBlueprint.js";
import createRoom, { INewRoomData } from "./commands/createRoom.js";
import createUser, { IUserData } from "./commands/createUser.js";
import { IDescription } from "./model/classes/Description.js";
import editUser from "./commands/editUser.js";
import saveSuggestions from "./commands/saveSuggestions.js";

export const formPromptForUserHandler = async (formData: any, socket: any) => {
  const formEventMap: Record<string, string> = {
    createItemBlueprintForm: "openCreateItemBlueprintForm",
    createMobBlueprintForm: "opencreateMobBlueprintForm",
    createRoomForm: "openCreateRoomForm",
    createUserForm: "openCreateUserForm",
    createZoneForm: "openCreateZoneForm",
    editItemBlueprintForm: "openEditItemBlueprintForm",
    editMobBlueprintForm: "openEditMobBlueprintForm",
    editRoomForm: "openEditRoomForm",
    editUserForm: "openEditUserForm",
    editZoneForm: "openEditZoneForm",
    eraseItemBlueprintForm: "openEraseItemBlueprintForm",
    eraseMobBlueprintForm: "openEraseMobBlueprintForm",
    eraseRoomForm: "openEraseRoomForm",
    gotoForm: "openGotoForm",
    suggestForm: "openSuggestForm",
    suggestionsForm: "openSuggestionsForm",
  };

  const eventName = formEventMap[formData.form];

  if (eventName) {
    if (["openCreateUserForm", "openCreateZoneForm"].includes(eventName)) {
      socket.emit(eventName);
    } else {
      socket.emit(eventName, formData);
    }
  }
};

export const messageArrayForUserHandler = async (
  messageArray: Array<IMessage>,
  socket: any
) => {
  try {
    for (let message of messageArray) {
      socket.emit(`message`, message);
    }
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`messageArrayForUserHandler`, error);
  }
};

export const messageForUserHandler = async (message: IMessage, socket: any) => {
  try {
    socket.emit(`message`, message);
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`messageForUserHandler`, error);
  }
};

export const messageForUsersRoomHandler = async (
  message: IMessage,
  socket: any,
  user: IUser
) => {
  try {
    socket.to(user.location.inRoom.toString()).emit(`message`, message);
  } catch (error: unknown) {
    catchErrorHandlerForFunction(
      `messageForUsersRoomHandler`,
      error,
      user?.name
    );
  }
};

export const messageForUsersZoneHandler = async (
  message: IMessage,
  socket: any,
  user: IUser
) => {
  try {
    socket.to(user.location.inZone.toString()).emit(`message`, message);
  } catch (error: unknown) {
    catchErrorHandlerForFunction(
      `messageForUsersZoneHandler`,
      error,
      user?.name
    );
  }
};

export const userSubmittedEditItemBlueprintHandler = async (
  itemBlueprintData: IEditItemBlueprintFormData,
  user: IUser
) => {
  try {
    purifyDescriptionOfObject(itemBlueprintData);
    await editItemBlueprint(itemBlueprintData, user);
    stats(user);
  } catch (error: unknown) {
    catchErrorHandlerForFunction(
      `userSubmittedEditItemBlueprintHandler`,
      error
    );
  }
};

export const userSubmittedEditMobBlueprintHandler = async (
  mobBlueprintData: IEditMobFormData,
  user: IUser
) => {
  try {
    purifyDescriptionOfObject(mobBlueprintData);
    await editMobBlueprint(mobBlueprintData, user);
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

export const userSubmittedGotoHandler = async (
  gotoFormData: ILocation,
  user: IUser
) => {
  try {
    worldEmitter.emit(
      `messageFor${user.username}sRoom`,
      makeMessage(`success`, `${user.name} disappears.`)
    );
    worldEmitter.emit(
      `messageFor${user.username}`,
      makeMessage(
        `success`,
        `You close your eyes for a moment, imagine the location, and appear there.`
      )
    );
    await relocateUser(user, gotoFormData);
    worldEmitter.emit(
      `messageFor${user.username}sRoom`,
      makeMessage(`success`, `${user.name} appears.`)
    );
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`userSubmittedGotoHandler`, error, user?.name);
  }
};

export const userSubmittedCreateItemBlueprintHandler = async (
  itemBlueprintData: ICreateItemBlueprintFormData,
  user: IUser
) => {
  try {
    purifyDescriptionOfObject(itemBlueprintData);
    await createItemBlueprint(itemBlueprintData, user);
    stats(user);
  } catch (error: unknown) {
    catchErrorHandlerForFunction(
      `userSubmittedCreateItemBlueprintHandler`,
      error,
      user?.name
    );
  }
};

export const userSubmittedCreateMobBlueprintHandler = async (
  mobBlueprintData: ICreateMobFormData,
  user: IUser
) => {
  try {
    purifyDescriptionOfObject(mobBlueprintData);
    await createMobBlueprint(mobBlueprintData, user);
    stats(user);
  } catch (error: unknown) {
    catchErrorHandlerForFunction(
      `userSubmittedCreateMobBlueprintHandler`,
      error,
      user?.name
    );
  }
};

export const userSubmittedCreateRoomHandler = async (
  roomData: INewRoomData,
  user: IUser
) => {
  try {
    purifyDescriptionOfObject(roomData);
    await createRoom(roomData, user);
    stats(user);
  } catch (error: unknown) {
    catchErrorHandlerForFunction(
      `userSubmittedCreateRoomHandler`,
      error,
      user?.name
    );
  }
};

export const userSubmittedCreateUserHandler = async (
  userData: IUserData,
  user: IUser
) => {
  try {
    purifyDescriptionOfObject(userData);
    const newUser = await createUser(userData, user);
    stats(user);
  } catch (error: unknown) {
    catchErrorHandlerForFunction(
      `userSubmittedCreateUserHandler`,
      error,
      user?.name
    );
  }
};

export const userSubmittedCreateZoneHandler = async (
  zoneData: IZoneData,
  user: IUser
) => {
  try {
    purifyDescriptionOfObject(zoneData);
    await createZone(zoneData, user);
    stats(user);
  } catch (error: unknown) {
    catchErrorHandlerForFunction(
      `userSubmittedCreateZoneHandler`,
      error,
      user?.name
    );
  }
};

export const userSubmittedEditUserHandler = async (
  userDescription: IDescription,
  user: IUser
) => {
  try {
    purifyDescriptionOfObject(userDescription);
    await editUser(user, userDescription);
    stats(user);
  } catch (error: unknown) {
    catchErrorHandlerForFunction(
      `userSubmittedEditUserHandler`,
      error,
      user?.name
    );
  }
};

export const userSubmittedSuggestHandler = async (
  suggestFormData: {
    _id: string;
    refersToObjectType: refersToObjectType;
    body: string;
  },
  user: IUser,
  socket: any
) => {
  try {
    suggestFormData = purifyAllStringPropsOfObject(suggestFormData);
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
      refersToId: new mongoose.Types.ObjectId(suggestFormData._id),
      refersToObjectType: suggestFormData.refersToObjectType,
      body: suggestFormData.body,
      status: "pending" as suggestionStatusType,
      history: historyStartingNow(),
    };

    switch (suggestFormData.refersToObjectType) {
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
    socket.emit(
      "message",
      makeMessage(
        "success",
        `We saved your suggestion for this ${suggestFormData.refersToObjectType}.`
      )
    );
    stats(user);
  } catch (error: unknown) {
    catchErrorHandlerForFunction(
      `userSubmittedSuggestHandler`,
      error,
      user?.name
    );
  }
};

export const userSubmittedSuggestionsHandler = async (
  suggestions: Array<ISuggestion>,
  user: IUser,
  socket: any
) => {
  try {
    const zone = await getZoneOfUser(user);
    if (!zone) {
      throw new Error(`Couldn't get ${user.username}'s zone.`);
    }
    await saveSuggestions(suggestions, zone);
    socket.emit(
      "message",
      makeMessage("success", `We saved the suggestions for ${zone.name}.`)
    );
  } catch (error: unknown) {
    catchErrorHandlerForFunction(
      `userSubmittedSuggestionsHandler`,
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
