// look
// shows the user what's in their room,
// or the description and contents of a target
import worldEmitter from "../model/classes/WorldEmitter.js";
import { IUser } from "../model/classes/User.js";
import IMessage from "../types/Message.js";
import { IParsedCommand } from "../util/parseCommand.js";
import getRoomOfUser from "../util/getRoomOfUser.js";
import lookRoom from "./lookRoom.js";
import lookTarget from "./lookTarget.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";

async function look(parsedCommand: IParsedCommand, user: IUser) {
  try {
    const room = await getRoomOfUser(user);
    if (!room) {
      throw new Error(`Room not found for user ${user.name}`)
    }
    let lookArray: Array<IMessage> = [];
    let target = parsedCommand.directObject;
    if (target === "room") {
      lookRoom(room, user, lookArray);
      worldEmitter.emit(`messageArrayFor${user.username}`, lookArray);
      return;
    }

    if (target) {
      lookTarget(target.toLowerCase(), room, lookArray);
      worldEmitter.emit(`messageArrayFor${user.username}`, lookArray);
      return;
    } else {
      lookRoom(room, user, lookArray);
    }

    worldEmitter.emit(`messageArrayFor${user.username}`, lookArray);
  } catch (error: unknown) {
    catchErrorHandlerForFunction("look", error, user.name);
  }
}

export default look;
