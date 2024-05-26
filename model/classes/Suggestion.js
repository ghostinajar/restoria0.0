import mongoose from 'mongoose';
import historySchema from './History.js';

const { Schema } = mongoose;

const suggestionSchema = new Schema({
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
    refersToMobBlueprint: {
        type: Schema.Types.ObjectId,
        ref: 'MobBlueprint'
    },
    refersToItemBlueprint: {
        type: Schema.Types.ObjectId,
        ref: 'ItemBlueprint'
    }, 
    body: String,
    history: {
        type: historySchema,
        default: () => ({})
    },
});

export default suggestionSchema;