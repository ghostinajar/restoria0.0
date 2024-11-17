// lookRoom
// populates the lookArray for the look command
import { IRoom } from "../model/classes/Room.js";
import { IUser } from "../model/classes/User.js";
import IMessage from "../types/Message.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import makeMessage from "../util/makeMessage.js";

function lookRoom(room: IRoom, user: IUser, lookArray: Array<IMessage>) {
  try {
    let roomNameMessage = makeMessage(`heading`, `${room.name}`);
    lookArray.push(roomNameMessage);

    let roomDescriptionMessage = makeMessage(
      `roomDescription`,
      `${room.description.examine}`
    );
    lookArray.push(roomDescriptionMessage);

    for (let itemInRoom of room.inventory) {
      const message = makeMessage(
        `itemIsHere`,
        `${itemInRoom.description.look}`
      );
      lookArray.push(message);
    }

    for (let mobInRoom of room.mobs) {
      const message = makeMessage(`mobIsHere`, `${mobInRoom.description.look}`);
      lookArray.push(message);
    }

    for (let userInRoom of room.users) {
      const message = makeMessage(`userIsHere`, `${userInRoom.name} is here.`);
      if (userInRoom.name !== user.name) lookArray.push(message);
    }
  } catch (error: unknown) {
    catchErrorHandlerForFunction("lookRoom", error, user.name)
  }
}

export default lookRoom;
