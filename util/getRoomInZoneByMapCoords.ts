import { IRoom } from "../model/classes/Room.js";
import { IZone } from "../model/classes/Zone.js";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";

function getRoomInZoneByCoords(coords: Array<number>, zone: IZone, ): IRoom | undefined {
  try {
    // Find the first room whose mapCoords matches the given coords
    return zone.rooms.find(room =>
      room.mapCoords.every((value, index) => value === coords[index])
    );
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`getRoomByCoords`, error);
    return undefined;
  }
}

export default getRoomInZoneByCoords;
