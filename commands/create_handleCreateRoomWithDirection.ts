// create_handleCreateRoomWithDirection
// utility for create command, handles "CREATE ROOM DIRECTION ?NAME"
// (create the room directly when a user has included a direction and optional room name in the command)

import {
  directionCorrectionString,
  directions,
  directionsAbbrev,
} from "../constants/DIRECTIONS.js";
import { IUser } from "../model/classes/User.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import messageToUsername from "../util/messageToUsername.js";
import createRoom, { ICreateRoomFormData } from "./createRoom.js";

async function create_handleCreateRoomWithDirection(
  direction: string,
  user: IUser,
  roomName?: string
) {
  try {
    // validate parameters, then call createRoom to create the room directly
    if (!direction) {
      throw new Error("Direction missing from command.");
    }
    if (!user) {
      throw new Error("User missing from command.");
    }

    // reject invalid direction parameter (must be "north" or "n", etc)
    if (
      !directions.includes(direction.toLowerCase()) &&
      !directionsAbbrev.includes(direction.toLowerCase())
    ) {
      messageToUsername(user.username, directionCorrectionString, `rejection`, true);
      return;
    }

    // if direction is abbreviated, convert to full direction
    const fullDirection =
      directions.find((dir) => dir.startsWith(direction.toLowerCase())) ||
      direction.toLowerCase();

    if (!fullDirection) {
      throw new Error("Invalid fullDirection.");
    }

    const roomData: ICreateRoomFormData = {
      name: roomName || `This zone's author needs to name this room.`,
      direction: fullDirection,
      description: {
        look: `This zone's author needs to write a LOOK description here.`,
        examine: `This zone's author needs to write an EXAMINE description here.`,
      },
    };

    // call createRoom to create the room directly
    const room = await createRoom(roomData, user);
  } catch (error: unknown) {
    catchErrorHandlerForFunction(
      `create_handleCreateRoomWithDirection`,
      error,
      user?.name
    );
  }
}

export default create_handleCreateRoomWithDirection;
