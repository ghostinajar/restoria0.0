import mongoose from 'mongoose';
import historySchema from './History.js';
import descriptionSchema from './Description.js';
import roomSchema from './Room.js';
import mobSchema from './Mob.js';
import itemSchema from './Item.js';
import suggestionSchema from './Suggestion.js';

const { Schema, model } = mongoose;   

try {
const zoneSchema = new Schema({
    numberInWorld: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    name: String,
    history: historySchema,
    description: descriptionSchema,
    rooms: [roomSchema],
    mobs: [mobSchema],
    items: [itemSchema],
    suggestions: [suggestionSchema],
});

const Zone = mongoose.model('Zone', zoneSchema);
} catch(err) {console.log(err)};

export default Zone;
