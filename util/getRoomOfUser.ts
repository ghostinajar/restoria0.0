import { IRoom } from "../model/classes/Room.js";
import { IUser } from "../model/classes/User.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";

async function getRoomOfUser(user: IUser) {
  try {
    const room: IRoom = await new Promise((resolve) => {
      worldEmitter.once(
        `zoneManagerReturningRoom${user.location.inRoom.toString()}`,
        resolve
      );
      worldEmitter.emit("roomRequested", user.location);
    });
    if (!room) {
      throw new Error(`room for user ${user.name} not found!`)
    }
    return room;
  } catch (error: unknown) {
    catchErrorHandlerForFunction("getRoomOfUser", error);
  }
}

export default getRoomOfUser;
