import mongoose from 'mongoose';
import descriptionSchema from './Description.js';
import affixSchema from './Affix.js';
import statBlockSchema from './StatBlock.js';
import locationSchema from './Location.js';
import itemSchema from './Item.js';

const { Schema } = mongoose;

const characterSchema = new Schema({
    name: { type: String, required: true, unique: true },
    displayName: { type: String, required: true, unique: true },
    pronouns: Number, // 0 = he/him, 1 = it/it, 2 = she/her, 3 = they/them
    location: {
        type: locationSchema,
        default: () => {}
    },
    creationDate: {
        type: Date,
        default: Date.now
    },
    hoursPlayed: Number,
    job: String,
    statBlock: {
    type: statBlockSchema,
    default: () => ({})
    },
    goldHeld: {
        type: Number,
        default: 0
    },
    goldBanked: {
        type: Number,
        default: 0
    },
    trainingPoints: {
        type: Number,
        default: 0
    },
    jobLevels: {
        cleric: {
            type: Number,
            default: 0
        },
        mage: {
            type: Number,
            default: 0
        },
        thief: {
            type: Number,
            default: 0
        },
        warrior: {
            type: Number,
            default: 0
        },
    },
    description: {
        type: descriptionSchema,
        default: () => ({})
    },
    //may change when training is implemented
    trained: {
        passives: [{
            name: String,
            level: Number
        }],
        spells: [{
            name: String,
            level: Number
        }],
    },
    inventory: [itemSchema],
    storage: [itemSchema],
    equipped: {
        arms: {
            type: itemSchema,
            default: null
        },
        body: {
            type: itemSchema,
            default: null
        },
        ears: {
            type: itemSchema,
            default: null
        },
        feet: {
            type: itemSchema,
            default: null
        },
        finger1: {
            type: itemSchema,
            default: null
        },
        finger2: {
            type: itemSchema,
            default: null
        },
        hands: {
            type: itemSchema,
            default: null
        },
        head: {
            type: itemSchema,
            default: null
        },
        held: {
            type: itemSchema,
            default: null
        },
        legs: {
            type: itemSchema,
            default: null
        },
        neck: {
            type: itemSchema,
            default: null
        },
        shield: {
            type: itemSchema,
            default: null
        },
        shoulders: {
            type: itemSchema,
            default: null
        },
        waist: {
            type: itemSchema,
            default: null
        },
        wrist1: {
            type: itemSchema,
            default: null
        },
        wrist2: {
            type: itemSchema,
            default: null
        },
        weapon1: {
            type: itemSchema,
            default: null
        },
        weapon2: {
            type: itemSchema,
            default: null
        }     
    },
    affixes: [{
        type: affixSchema,
        default: () => ({})
    }],
});

characterSchema.pre('save', function(next) {
    this.name = this.displayName.toLowerCase();
    next();
});
  
characterSchema.pre('findOneAndUpdate', function(next) {
    this._update.name = this._update.displayName.toLowerCase();
    next();
});

export default characterSchema;