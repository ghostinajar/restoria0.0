// Bug
// (reported by user)
import mongoose from "mongoose";
import historySchema, { IHistory } from "./History.js";
import locationSchema, { ILocation } from "./Location.js";
import WORLD_RECALL from "../../constants/WORLD_RECALL.js";

const { Schema } = mongoose;

export interface IBug extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  history: IHistory;
  description: string;
  location: ILocation;
  isValid: boolean;
}

const bugSchema = new Schema({
  _id: Schema.Types.ObjectId,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  history: {
    type: historySchema,
    default: () => ({}),
  },
  description: {
    type: String,
    default: "",
  },
  location: {
    type: locationSchema,
    required: true,
    default: WORLD_RECALL,
  },
  isValid: { type: Boolean, default: false },
});

const Bug = mongoose.model("Bug", bugSchema);

export default Bug;
