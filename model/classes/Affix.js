import mongoose from "mongoose";
const { Schema } = mongoose;
const affixSchema = new Schema({
    affixType: {
        type: String,
        required: true,
    },
    value: {
        type: Number,
        required: true,
    },
    currentTweak: Number,
    secondsRemaining: Number,
});
export default affixSchema;
