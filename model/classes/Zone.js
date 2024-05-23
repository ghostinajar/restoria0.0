import mongoose from 'mongoose';
import historySchema from './History.js';
import descriptionSchema from './Description.js';
import roomSchema from './Room.js';
import mobSchema from './Mob.js';
import itemSchema from './Item.js';
import suggestionSchema from './Suggestion.js';

const { Schema, model } = mongoose;   

const zoneSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    name: String,
    history: historySchema,
    description: descriptionSchema,
    rooms: {type: Map, of: roomSchema},
    mobs: {type: Map, of: mobSchema},
    items: {type: Map, of: itemSchema},
    suggestions: {type: Map, of: suggestionSchema},
});

const Zone = mongoose.model('Zone', zoneSchema);

export default Zone;
