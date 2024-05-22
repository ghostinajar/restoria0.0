import mongoose from "mongoose";

const { Schema } = mongoose;

const affixSchema = new Schema({
        affixType: String,
        value: Number,
        currentTweak: Number,
        secondsRemaining: Number,
});

export default affixSchema;