import mongoose from 'mongoose';
import historySchema, { IHistory } from './History.js';

const { Schema } = mongoose;

export type refersToObjectType = 'room' | 'itemBlueprint' | 'mobBlueprint' | 'zone';


export interface ISuggestion {
    authorId: mongoose.Types.ObjectId;
    authorName: string;
    refersToId: mongoose.Types.ObjectId;
    refersToObjectType: refersToObjectType,
    body: string;
    history: IHistory
}

const suggestionSchema = new Schema<ISuggestion>({
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