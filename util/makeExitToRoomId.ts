// makeExitToRoomId
// used by createRoom (createRoom will catch and handle error)
import mongoose from "mongoose";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";

function makeExitToRoomId(
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
      hiddenByDefault: false,
      closedByDefault: false,
      isClosed: false,
      isLocked: false,
    };
    return newExit;
  } catch (error: unknown) {
    catchErrorHandlerForFunction("makeExitToRoomId", error)
  }
}

export default makeExitToRoomId;
