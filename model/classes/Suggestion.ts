import mongoose from 'mongoose';
import historySchema, { IHistory } from './History.js';

const { Schema } = mongoose;

export type refersToObjectType = 'room' | 'item' | 'mob' | 'zone';
export type suggestionStatusType = 'pending' | 'completed' | 'declined'

export interface ISuggestion {
    authorId: mongoose.Types.ObjectId;
    authorName: string;
    refersToId: mongoose.Types.ObjectId;
    refersToObjectType: refersToObjectType,
    body: string;
    status: suggestionStatusType;
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