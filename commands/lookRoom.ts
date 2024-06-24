import { IRoom } from "../model/classes/Room.js";
import { IUser } from "../model/classes/User.js";
import IMessage from "../types/Message.js";
import makeMessage from "../types/makeMessage.js";

function lookRoom(room: IRoom, user: IUser, lookArray: Array<IMessage>) {
  //push a message for the room's name into look Array
  let roomNameMessage = makeMessage(`heading`, `${room.name}`);
  lookArray.push(roomNameMessage);
  //push a message for the room's description.look into look Array
  let roomDescriptionMessage = makeMessage(
    `roomDescription`,
    `${room.description.look}`
  );
  lookArray.push(roomDescriptionMessage);
  //push a message for each item's description.look into lookArray
  for (let itemInRoom of room.inventory) {
    const message = makeMessage(`itemIsHere`, `${itemInRoom.description.look}`);
    lookArray.push(message);
  }
  //push a message for each mob's description.look into lookArray
  for (let mobInRoom of room.mobs) {
    const message = makeMessage(`mobIsHere`, `${mobInRoom.description.look}`);
    lookArray.push(message);
  }
  //push a message for each user's name + `is here.` into lookArray
  for (let userInRoom of room.users) {
    const message = makeMessage(`userIsHere`, `${userInRoom.name} is here.`);
    if (userInRoom.name !== user.name) lookArray.push(message);
  }
}

export default lookRoom;
