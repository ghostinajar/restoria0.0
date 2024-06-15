// look
import logger from "../logger.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import makeMessage from "../types/makeMessage.js";
import { IUser } from "../model/classes/User.js";
import { IRoom } from "../model/classes/Room.js";
import IMessage from "../types/Message.js";

async function look(user: IUser) {
  logger.debug(`look command initiated`);
  const room: IRoom = await new Promise((resolve) => {
    worldEmitter.once(`zoneManagerReturningRoom${user.location.inRoom.toString()}`, resolve);
    worldEmitter.emit("roomRequested", user.location);
  });

  let lookArray: Array<IMessage> = [];

  //push a message for the room's name into look Array
  let roomNameMessage = makeMessage(
    true,
    `roomName`,
    `${room.name}`
  );  
  lookArray.push(roomNameMessage);  
  //push a message for the room's description.look into look Array
  let roomDescriptionMessage = makeMessage(
    true,
    `roomDescription`,
    `${room.description.look}`
  );
  lookArray.push(roomDescriptionMessage);  
  //push a message for each item's description.look into lookArray
  for (let itemInRoom of room.items) {
    const message = makeMessage(true, `itemIsHere`, `${itemInRoom.description.look}`);
    lookArray.push(message);
  }
  //push a message for each mob's description.look into lookArray
  for (let mobInRoom of room.mobs) {
    const message = makeMessage(true, `mobIsHere`, `${mobInRoom.description.look}`);
    lookArray.push(message);
  }
  //push a message for each user's name + `is here.` into lookArray
  for (let userInRoom of room.users) {
    const message = makeMessage(
      false,
      `userIsHere`,
      `${userInRoom.name} is here.`
    );
    lookArray.push(message);
  }

  logger.debug(`lookArray gathered: ${JSON.stringify(lookArray)}`);
  worldEmitter.emit(`messageArrayFor${user.username}`, lookArray);
}

export default look;
