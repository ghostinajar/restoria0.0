// getZoneNamesByAuthorId
import mongoose from "mongoose";
import Zone from "../model/classes/Zone.js";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";

async function getZoneNamesByAuthorId(authorId: string) {
  try {
    const zones = await Zone.find({ author: authorId })
      .select("name _id rooms")
      .populate({
        path: "rooms",
        select: "name _id",
      })
      .lean();

    return (
      zones.map((zone) => ({
        name: zone.name as string,
        _id: zone._id.toString(),
        roomNames: (
          zone.rooms as Array<{ name: string; _id: mongoose.Types.ObjectId }>
        ).map((room) => ({
          name: room.name,
          _id: room._id.toString(),
        })),
      })) || []
    );
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`getZoneNamesByAuthorId`, error);
    return [];
  }
}

export default getZoneNamesByAuthorId;