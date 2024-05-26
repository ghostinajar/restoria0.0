import mongoose from 'mongoose';
import historySchema from './History.js';
import descriptionSchema from './Description.js';
import roomSchema from './Room.js';
import mobBlueprintSchema from './MobBlueprint.js';
import itemBlueprintSchema from './ItemBlueprint.js';
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
    mobBlueprintss: {type: Map, of: {
        type: mobBlueprintSchema,
        default: () => ({})
        }
    },
    itemBlueprints: {type: Map, of: {
        type: itemBlueprintSchema,
        default: () => ({})
        }
    },
    suggestions: {type: Map, of: {
        type: suggestionSchema,
        default: () => ({})
        }
    },
    minutesToRepop: {
        type: Number,
        default: 15,
        min: [5, 'The value of `{PATH}` (`{VALUE}`) is beneath the limit of `{MIN}`.'],
        max: [120, 'The value of `{PATH}` (`{VALUE}`) exceeds the limit of `{MAX}`.']
    }
});

const Zone = mongoose.model('Zone', zoneSchema);

export default Zone;
