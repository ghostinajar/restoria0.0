// getLookArrayForRoom
// gets the lookArray for the look command targeting a room
import { IRoom } from "../model/classes/Room.js";
import { IUser } from "../model/classes/User.js";
import IMessage from "../types/Message.js";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
import makeMessage from "./makeMessage.js";

function getLookArrayForRoom(
  room: IRoom,
  user: IUser,
) {
  try {
    let lookArray : Array<IMessage> = [];
    let roomNameMessage = makeMessage(`heading`, `${room.name}`);
    lookArray.push(roomNameMessage);

    let roomDescriptionMessage = makeMessage(
      `description`,
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
    return lookArray
  } catch (error: unknown) {
    catchErrorHandlerForFunction("getLookArrayForRoom", error, user.name);
  }
}

export default getLookArrayForRoom;
