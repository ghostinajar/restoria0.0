// Bug
// (reported by user)
import mongoose from "mongoose";
import historySchema from "./History.js";
import locationSchema from "./Location.js";
import WORLD_RECALL from "../../constants/WORLD_RECALL.js";
const { Schema } = mongoose;
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
