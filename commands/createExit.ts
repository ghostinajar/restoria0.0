// createExit
// used by createRoom (createRoom will catch and handle error)
import mongoose from "mongoose";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";

function createExit(
  toRoomId: mongoose.Types.ObjectId,
  inZoneId: mongoose.Types.ObjectId
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
