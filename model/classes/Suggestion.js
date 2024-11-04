import mongoose from 'mongoose';
import historySchema from './History.js';
const { Schema } = mongoose;
const suggestionSchema = new Schema({
    authorId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    authorName: String,
    refersToId: Schema.Types.ObjectId,
    refersToObjectType: {
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
