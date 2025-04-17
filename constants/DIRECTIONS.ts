// DIRECTIONS
// constants file for directions

import { IUser } from "../model/classes/User.js";
import messageToUsername from "../util/messageToUsername.js";

export type Direction = "north" | "east" | "south" | "west" | "up" | "down";

export const directions = ["north", "east", "south", "west", "up", "down"];

export const directionsAbbrev = ["n", "e", "s", "w", "u", "d"];

export const oppositeDirections = {
  north: "south",
  south: "north",
  east: "west",
  west: "east",
  up: "down",
  down: "up",
};

export const directionCorrectionString = `What direction? Try: ${directions.join(
  ", "
)}, ${directionsAbbrev.join(", ")}).`;

export function expandAbbreviatedDirection(
  direction: string
): Direction | null {
  const expandedDirection = directions.find((dir) => dir.startsWith(direction));
  return expandedDirection ? (expandedDirection as Direction) : null;
}

// handles an invalid, missing, and abbreviated direction
export function processDirection(
  direction: string | undefined | null,
  user: IUser
): Direction | null {
  // handle invalid or missing direction
  if (!direction || !directions.some((dir) => dir.startsWith(direction))) {
    messageToUsername(
      user.username,
      directionCorrectionString,
      `rejection`,
      true
    );
    return null;
  }

  // expand direction abbreviation
  const expandedDirection = expandAbbreviatedDirection(direction);
  return expandedDirection;
}
