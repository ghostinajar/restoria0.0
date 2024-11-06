// createExit
// used by createRoom (createRoom will catch and handle error)

import mongoose, { Schema } from "mongoose";

function createExit(toRoomId: mongoose.Types.ObjectId, inZoneId : mongoose.Types.ObjectId) {
  const newExit = {
    destinationLocation: {
      inZone: inZoneId,
      inRoom: toRoomId,
    },
    toExternalZone: false,
    isHidden: false,
    isClosed: false,
    };
    return newExit
  };

export default createExit;