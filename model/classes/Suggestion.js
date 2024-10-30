import mongoose from 'mongoose';
import historySchema from './History.js';
const { Schema } = mongoose;
const suggestionSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    refersToId: Schema.Types.ObjectId,
    isForRoom: Boolean,
    isForMobBlueprint: Boolean,
    isForItemBlueprint: Boolean,
    body: String,
    history: {
        type: historySchema,
        default: () => ({})
    },
});
export default suggestionSchema;
