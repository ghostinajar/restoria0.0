// map
// sends user mapTileState (map tile + wall/exit states) for their current room

import { IUser } from "../model/classes/User.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import getRoomOfUser from "../util/getRoomOfUser.js";
import getZoneOfUser from "../util/getZoneofUser.js";

export interface IMapTileState {
  zone: string;
  mapCoords: [number, number, number];
  mapTile: {
    character: string;
    color: string;
    wallColor: string;
  };
  north: string;
  east: string;
  south: string;
  west: string;
  [key: string]:
    | string
    | [number, number, number]
    | { character: string; color: string; wallColor: string };
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

    const mapTileState: IMapTileState = {
      zone: zone.name,
      mapCoords: room.mapCoords,
      mapTile: room.mapTile,
      north: "?",
      east: "?",
      south: "?",
      west: "?",
    };
    const directions = ["north", "east", "south", "west"];

    directions.forEach((direction) => {
      if (room.exits[direction]) {
        if (room.exits[direction].isClosed) {
          mapTileState[direction] = "closed";
        } else {
          mapTileState[direction] = "open";
        }
      } else {
        mapTileState[direction] = "wall";
      }
    });
    worldEmitter.emit(`mapTileStateFor${user.username}`, mapTileState);
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`map`, error, user?.name);
  }
}

export default map;
