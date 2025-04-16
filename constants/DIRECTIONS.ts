// DIRECTIONS
// constants file for directions

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

export const directionCorrectionString = `Invalid direction. Try: ${directions.join(
  ", "
)}, ${directionsAbbrev.join(", ")}).`;

export function expandAbbreviatedDirection(
  direction: string
): Direction | null {
  const expandedDirection = directions.find((dir) => dir.startsWith(direction));
  return expandedDirection ? (expandedDirection as Direction) : null;
}

export function isValidDirection(direction: string): direction is Direction {
  return directions.includes(direction as Direction);
}
