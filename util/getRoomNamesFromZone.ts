//getRoomNamesFromZone
import { IZone } from "../model/classes/Zone.js";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";

function getRoomNamesFromZone(zone: IZone) {
  try {
    const roomNames = zone.rooms.map((room) => {
      return { _id: room._id, name: room.name };
    });
    return roomNames;
  } catch (error: unknown) {
    catchErrorHandlerForFunction("getRoomNamesFromZone", error);
  }
}

export default getRoomNamesFromZone;
