import mongoose from 'mongoose';
import historySchema, { IHistory } from './History.js';

const { Schema } = mongoose;

export type SuggestionType = 'room' | 'itemBlueprint' | 'mobBlueprint';


export interface ISuggestion {
    author: mongoose.Types.ObjectId;
    refersToId: mongoose.Types.ObjectId;
    suggestionType: SuggestionType,
    body: string;
    history: IHistory
}

const suggestionSchema = new Schema<ISuggestion>({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    refersToId: Schema.Types.ObjectId,
    suggestionType: {
        type: String,
        enum: ['room', 'itemBlueprint', 'mobBlueprint'],
        required: true
    },
    body: String,
    history: {
        type: historySchema,
        default: () => ({})
    },
});

export default suggestionSchema;