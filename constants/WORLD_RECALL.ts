import mongoose from "mongoose";
import dotenv from "dotenv";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
dotenv.config();

try {
  if (!process.env.WORLD_RECALL_ZONEID || !process.env.WORLD_RECALL_ROOMID) {
    throw new Error(
      "Missing environment variables for WORLD_RECALL_ZONEID or WORLD_RECALL_ROOMID"
    );
  }
} catch (error: unknown) {
  catchErrorHandlerForFunction(`dotenvCheck`, error);
}

const WORLD_RECALL = {
  inZone: new mongoose.Types.ObjectId(process.env.WORLD_RECALL_ZONEID),
  inRoom: new mongoose.Types.ObjectId(process.env.WORLD_RECALL_ROOMID),
};

export default WORLD_RECALL;
