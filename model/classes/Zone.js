import mongoose from 'mongoose';
import historySchema from './History.js';
import descriptionSchema from './Description.js';
import roomSchema from './Room.js';
import mobBlueprintSchema from './MobBlueprint.js';
import itemBlueprintSchema from './ItemBlueprint.js';
import suggestionSchema from './Suggestion.js';
import logger from '../../logger.js';
import { EventEmitter } from 'events';

class ZoneEmitter extends EventEmitter {}

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
    mobBlueprints: {type: Map, of: {
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

zoneSchema.pre('init', function() {
    this.zoneEmitter = new ZoneEmitter();
    //setup listeners here (each zone will have its own set of the listeners defined here)
  });

zoneSchema.methods.removeFromWorld = function() {
    try {
        // Remove all listeners from the zoneEmitter
        this.zoneEmitter.removeAllListeners();
        // Empty the rooms array
        for (let room of this.rooms.values()) {
        // Assuming each room has a method to clear its contents
        room.clearContents();
        // Remove the room from the zone
        this.rooms.delete(room._id.toString());
        }
        logger.info(`Active rooms in ${this.name}: ${JSON.stringify(Array.from(this.rooms.values()).map(room => room.name))}`);
    } catch(err) {
        logger.error(`Error in zoneSchema.methods.removeFromWorld(): ${err.message}`)
        throw err;
    }
};

const Zone = mongoose.model('Zone', zoneSchema);

export default Zone;
