// createExit
// used by createRoom (createRoom will catch and handle error)
import mongoose from "mongoose";
import logger from "../logger";

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
    if (error instanceof Error) {
      logger.error(`createExit error: ${error.message}`);
    } else {
      logger.error(`createExit error: ${error}`);
    }
  }
}

export default createExit;
