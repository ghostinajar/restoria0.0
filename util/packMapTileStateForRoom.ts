// packMapTileStateForRoom
// packs a mapTileState for a given room

import { IMapTileState } from "../commands/map.js";
import { IRoom } from "../model/classes/Room.js";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";

async function packMapTileStateForRoom(room: IRoom) {
  try {
    const mapTileState: IMapTileState = {
      mapCoords: room.mapCoords,
      mapTile: room.mapTile,
      walls: {
        north: "?",
        east: "?",
        south: "?",
        west: "?",
      },
    };

    // populate walls
    const directions = ["north", "east", "south", "west"];
    directions.forEach((direction) => {
      if (room.exits[direction]) {
        if (room.exits[direction].isClosed) {
          mapTileState.walls[direction] = "closed";
        } else {
          mapTileState.walls[direction] = "open";
        }
        if (room.exits[direction].hiddenByDefault) {
          mapTileState.walls[direction] = "wall";
        }
      } else {
        mapTileState.walls[direction] = "wall";
      }
    });
    return mapTileState;
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`packMapTileStateForRoom`, error);
  }
}

export default packMapTileStateForRoom;
