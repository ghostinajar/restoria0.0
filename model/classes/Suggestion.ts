import mongoose from 'mongoose';
import historySchema, { IHistory } from './History.js';

const { Schema } = mongoose;

export interface ISuggestion {
    author: mongoose.Types.ObjectId;
    refersToRoom: mongoose.Types.ObjectId;
    refersToMobBlueprint: mongoose.Types.ObjectId;
    refersToItemBlueprint: mongoose.Types.ObjectId;
    body: string;
    history: IHistory
}

const suggestionSchema = new Schema<ISuggestion>({
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