// getZoneNamesByAuthorId

import mongoose from "mongoose";
import Zone from "../model/classes/Zone.js";
import { performance } from "perf_hooks";

async function getZoneNamesByAuthorId(
  authorId: string
): Promise<
  Array<{
    name: string;
    _id: string;
    roomNames: Array<{ name: string; _id: string }>;
  }>
> {
  try {
    // const start = performance.now(); // Start time
    const zones = await Zone.find({ author: authorId })
      .select("name _id rooms")
      .populate({
        path: "rooms",
        select: "name _id",
      })
      .lean();
    // const query = performance.now(); // Query time
    // console.log(`Query time: ${query - start} ms`);
    // const end = performance.now(); // End time
    // console.log(`Map time: ${end - query} ms`);
    
    return zones.map((zone) => ({
      name: zone.name as string,
      _id: zone._id.toString(),
      roomNames: (
        zone.rooms as Array<{ name: string; _id: mongoose.Types.ObjectId }>
      ).map((room) => ({
        name: room.name,
        _id: room._id.toString(),
      })),
    }));

  } catch (err) {
    console.error("Error fetching zones by author:", err);
    throw err;
  }
}

export default getZoneNamesByAuthorId;
