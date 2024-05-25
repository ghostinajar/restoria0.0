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
    history: {
        type: historySchema,
        default: () => ({})
    },
    description: {
        type: descriptionSchema,
        default: () => ({})
    },
    rooms: {type: Map, of: {
        type: roomSchema,
        default: () => ({})
        }
    },
    mobs: {type: Map, of: {
        type: mobSchema,
        default: () => ({})
        }
    },
    items: {type: Map, of: {
        type: itemSchema,
        default: () => ({})
        }
    },
    suggestions: {type: Map, of: {
        type: suggestionSchema,
        default: () => ({})
        }
    },
    minutesToRepop: {
        type: number,
        default: 15,
        min: [5, 'The value of `{PATH}` (`{VALUE}`) is beneath the limit of `{MIN}`.'],
        max: [120, 'The value of `{PATH}` (`{VALUE}`) exceeds the limit of `{MAX}`.']
    }
});

const Zone = mongoose.model('Zone', zoneSchema);

export default Zone;
