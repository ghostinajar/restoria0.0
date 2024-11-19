// createExit
// allows user to create an exit between two existing rooms
import mongoose from "mongoose";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import { IZone } from "../model/classes/Zone.js";
import { IUser } from "../model/classes/User.js";

function createExit(
  toRoomId: mongoose.Types.ObjectId,
  inZoneId: mongoose.Types.ObjectId,
  user: IUser
) {
  try {
    const newExit = {
      destinationLocation: {
        inZone: inZoneId,
        inRoom: toRoomId,
      },
      toExternalZone: false,
      isHidden: false,
      isClosed: false,
    };
    return newExit;
  } catch (error: unknown) {
    catchErrorHandlerForFunction("createExit", error)
  }
}

export default createExit;
