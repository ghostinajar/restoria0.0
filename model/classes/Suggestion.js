import mongoose from 'mongoose';
import historySchema from './History.js';
const { Schema } = mongoose;
const suggestionSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    refersToId: Schema.Types.ObjectId,
    suggestionType: {
        type: String,
        enum: ['room', 'itemBlueprint', 'mobBlueprint', 'zone'],
        required: true
    },
    body: String,
    history: {
        type: historySchema,
        default: () => ({})
    },
});
export default suggestionSchema;
