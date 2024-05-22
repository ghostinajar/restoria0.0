import mongoose from 'mongoose';
import historySchema from './History.js';

const { Schema } = mongoose;

const suggestionSchema = new Schema({
    suggestionNumber: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    refersToRoomId: String, // how can we reference a Room's ObjectId, which would be embedded in a zone?
    refersToMobId: String, // how can we reference a Mob's ObjectId, which would be embedded in a zone?
    refersToItemId: String, // how can we reference a Item's ObjectId, which would be embedded in a zone?
    body: String,
    history: historySchema,
});

export default suggestionSchema;