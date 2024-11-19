// coordsOccupiedInZone
// check if any room in the zone occupies certain mapCoords
import { IZone } from "../model/classes/Zone.js";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";

function coordsOccupiedInZone(zone: IZone, coords: Array<number>): boolean {
  try {
    return zone.rooms.some(room =>
      // does every value of room.mapCoords match, in the same order?
      room.mapCoords.every((value, index) => value === coords[index])
    );
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`coordsOccupiedInZone`, error);
    return false;
  }
}

export default coordsOccupiedInZone;
