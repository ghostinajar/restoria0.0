// map
// sends user mapTileState (map tile + wall/exit states) for their current room

import { IUser } from "../model/classes/User.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import getRoomOfUser from "../util/getRoomOfUser.js";
import getZoneOfUser from "../util/getZoneofUser.js";

export interface IMapTileState {
  mapCoords: [number, number, number];
  mapTile: {
    character: string;
    color: string;
    wallColor: string;
  };
  walls: {
    north: string;
    east: string;
    south: string;
    west: string;
    [key: string]: string;
  };
  [key: string]:
    | string
    | [number, number, number]
    | { character: string; color: string; wallColor: string }
    | { north: string; east: string; south: string; west: string };
}

async function map(user: IUser) {
  try {
    const room = await getRoomOfUser(user);
    if (!room) {
      throw new Error("map command couldn't find user's room.");
    }
    const zone = await getZoneOfUser(user);
    if (!zone) {
      throw new Error("map command couldn't find user's zone.");
    }

    const zoneFloorName = `${zone.name} Floor ${room.mapCoords[2]}`

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
    worldEmitter.emit(`mapRequestFor${user.username}`, zoneFloorName, mapTileState);
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`map`, error, user?.name);
  }
}

export default map;
