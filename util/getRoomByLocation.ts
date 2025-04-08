// getRoomByLocation
// given an ILocation, get the room object via zone manager

import { ILocation } from "../model/classes/Location.js";
import { IRoom } from "../model/classes/Room.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";

async function getRoomByLocation(location: ILocation) {
  try {
    const requestedRoom : IRoom = await new Promise((resolve) => {
      worldEmitter.once(
        `zoneManagerReturningRoom${location.inRoom.toString()}`,
        resolve
      );
      worldEmitter.emit(
        `roomRequested`,
        location
      );
    });
    return requestedRoom;
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`getRoomByLocation`, error);
  }
}

export default getRoomByLocation;