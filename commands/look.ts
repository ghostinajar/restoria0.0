// look
import logger from "../logger.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import { IUser } from "../model/classes/User.js";
import { IRoom } from "../model/classes/Room.js";
import IMessage from "../types/Message.js";
import { IParsedCommand } from "../util/parseCommand.js";
import getRoomOfUser from "../util/getRoomOfUser.js";
import lookRoom from "./lookRoom.js";
import lookTarget from "./lookTarget.js";

async function look(parsedCommand: IParsedCommand, user: IUser) {
  // logger.debug(`look command initiated`);
  const room: IRoom = await getRoomOfUser(user);
  let lookArray: Array<IMessage> = [];
  let target = parsedCommand.directObject;

  if (target) {
    // logger.debug(`look command targeting ${target}`);
    lookTarget(target.toLowerCase(), room, lookArray);
    // logger.debug(`lookArray gathered: ${JSON.stringify(lookArray)}`);
    worldEmitter.emit(`messageArrayFor${user.username}`, lookArray);
    return;
  } else {
    lookRoom(room, user, lookArray);
  }

  // logger.debug(`lookArray gathered: ${JSON.stringify(lookArray)}`);
  worldEmitter.emit(`messageArrayFor${user.username}`, lookArray);
}

export default look;
