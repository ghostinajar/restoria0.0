import { IZone } from "../model/classes/Zone.js";

async function getRoomNamesFromZone(zone: IZone) {
  const roomNames = zone.rooms.map((room) => {
    return { _id: room._id, name: room.name };
  });
  return roomNames;
}

export default getRoomNamesFromZone;
