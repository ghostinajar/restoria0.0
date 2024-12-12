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
        enum: ['room', 'item', 'mob', 'zone'],
        required: true
    },
    body: String,
    status: {
        type: String,
        enum: ['pending', 'completed', 'declined'],
        required: true
    },
    history: {
        type: historySchema,
        default: () => ({})
    },
});
export default suggestionSchema;
