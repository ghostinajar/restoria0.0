// DIRECTIONS
// constants file for directions

export type Direction = "north" | "east" | "south" | "west" | "up" | "down";

export const directions = [
  "north",
  "east",
  "south",
  "west",
  "up",
  "down",
];

export const directionsAbbrev = [
  "n",
  "e",
  "s",
  "w",
  "u",
  "d",
];

export const oppositeDirections = {
  north: 'south',
  south: 'north',
  east: 'west',
  west: 'east',
  up: 'down',
  down: 'up'
};