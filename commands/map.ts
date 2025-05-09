// map
// parse and execute MAP command for parameter options
// (e.g. MAP ON, MAP OFF, MAP 7, and MAP on its own)

import { IUser } from "../model/classes/User.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import emitUserPreferenceToClient from "../util/emitUserPreferenceToClient.js";
import getRoomOfUser from "../util/getRoomOfUser.js";
import getZoneOfUser from "../util/getZoneofUser.js";
import messageToUsername from "../util/messageToUsername.js";
import packMapTileStateForRoom from "../util/packMapTileStateForRoom.js";
import { IParsedCommand } from "../util/parseCommand.js";
import save from "./save.js";

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

async function map(parsedCommand: IParsedCommand, user: IUser) {
  try {
    let directObject = parsedCommand.directObject?.toLowerCase();

    // handle invalid parameters (we can only use undefined, ON, OFF, or a number)
    if (
      directObject !== undefined &&
      directObject.toString() !== "off" &&
      directObject.toString() !== "on" &&
      isNaN(Number(directObject))
    ) {
      messageToUsername(
        user.username,
        `Try MAP (on its own), MAP ON, MAP OFF, or MAP 7 (changes map radius to 7).`,
        `help`
      );
      messageToUsername(user.username, `Read HELP MAP to learn more.`, `help`);
      return;
    }

    // handle a number parameter
    if (!isNaN(Number(directObject))) {
      let newMapRadius = Number(directObject);
      if (newMapRadius > 12) {
        newMapRadius = 12;
      } else if (newMapRadius < 1) {
        newMapRadius = 1;
      }
      user.preferences.mapRadius = newMapRadius;
      await save(user);
      await emitUserPreferenceToClient(user, "mapRadius", newMapRadius);
      messageToUsername(
        user.username,
        `MAP radius set to ${newMapRadius}! It can be any number from 1-12.`,
        `help`
      );
    }

    // handle "on" or "off" parameter
    if (parsedCommand.directObject?.toLowerCase() === "off") {
      user.preferences.autoMap = false;
      await save(user);
      await emitUserPreferenceToClient(user, "autoMap", false);
      messageToUsername(user.username, `Auto MAP is OFF.`, `help`);
    }
    if (parsedCommand.directObject?.toLowerCase() === "on") {
      user.preferences.autoMap = true;
      await save(user);
      await emitUserPreferenceToClient(user, "autoMap", true);
      messageToUsername(user.username, `Auto MAP is ON.`, `help`);
    }

    const room = await getRoomOfUser(user);
    if (!room) {
      throw new Error("map command couldn't find user's room.");
    }
    const zone = await getZoneOfUser(user);
    if (!zone) {
      throw new Error("map command couldn't find user's zone.");
    }

    // handle no parameter (pack and send mapRequest to user)
    const mapTileState = await packMapTileStateForRoom(room);
    if (!mapTileState) {
      throw new Error(
        "map command couldn't pack mapTileState for user's room."
      );
    }
    const zoneFloorName = `${zone.name} Floor ${room.mapCoords[2]}`;
    worldEmitter.emit(
      `mapRequestFor${user.username}`,
      zoneFloorName,
      mapTileState
    );
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`map`, error, user?.name);
  }
}

export default map;
