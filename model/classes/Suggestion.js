import mongoose from 'mongoose';
import historySchema from './History.js';

const { Schema } = mongoose;

const suggestionSchema = new Schema({
    suggestionNumber: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    //probably won't need to reference Zone ObjectId since suggestions in a zone 
    //will only refer to things within that zone
    refersToRoom: {
        type: Schema.Types.ObjectId,
        ref: 'Room'
    },
    refersToMob: {
        type: Schema.Types.ObjectId,
        ref: 'Mob'
    },
    refersToItem: {
        type: Schema.Types.ObjectId,
        ref: 'Item'
    }, 
    body: String,
    history: historySchema,
});

export default suggestionSchema;