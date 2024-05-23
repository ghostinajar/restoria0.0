import mongoose from 'mongoose';
import descriptionSchema from './Description.js';
import affixSchema from './Affix.js';
import statBlockSchema from './StatBlock.js';
import locationSchema from './Location.js';

const { Schema, model } = mongoose;

const characterSchema = new Schema({
    name: String,
    pronouns: Number, // 0 = it/it, 1 = he/him, 2 = she/her, 3 = they/them
    location: {
    type: locationSchema,
    default: () => ({})
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
    goldHeld: Number,
    goldBanked: Number,
    trainingPoints: Number,
    jobLevels: {
        cleric: Number,
        mage: Number,
        thief: Number,
        warrior: Number
    },
    description: {
        type: descriptionSchema,
        default: () => ({})
    },
    //TODO decide how to implement training. should name be one from a list of SPELLS constants?
    //should I merge command authorization with character ability authorization, where most commands
    //like create room have a default level 1, but trainable abilities like bash or cast fireball
    //can have higher levels which help calculate their effects?
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
    inventory: {
        type: Map,
        of: {
          type: Schema.Types.ObjectId,
          ref: 'ItemInstance'
        }
    },
    equipped: {
        arms: {
            type: Schema.Types.ObjectId,
            ref: 'ItemInstance'
        },
        body: {
            type: Schema.Types.ObjectId,
            ref: 'ItemInstance'
        },
        ears: {
            type: Schema.Types.ObjectId,
            ref: 'ItemInstance'
        },
        feet: {
            type: Schema.Types.ObjectId,
            ref: 'ItemInstance'
        },
        finger1: {
            type: Schema.Types.ObjectId,
            ref: 'ItemInstance'
        },
        finger2: {
            type: Schema.Types.ObjectId,
            ref: 'ItemInstance'
        },
        hands: {
            type: Schema.Types.ObjectId,
            ref: 'ItemInstance'
        },
        head: {
            type: Schema.Types.ObjectId,
            ref: 'ItemInstance'
        },
        held: {
            type: Schema.Types.ObjectId,
            ref: 'ItemInstance'
        },
        legs: {
            type: Schema.Types.ObjectId,
            ref: 'ItemInstance'
        },
        neck: {
            type: Schema.Types.ObjectId,
            ref: 'ItemInstance'
        },
        shield: {
            type: Schema.Types.ObjectId,
            ref: 'ItemInstance'
        },
        shoulders: {
            type: Schema.Types.ObjectId,
            ref: 'ItemInstance'
        },
        waist: {
            type: Schema.Types.ObjectId,
            ref: 'ItemInstance'
        },
        wrist1: {
            type: Schema.Types.ObjectId,
            ref: 'ItemInstance'
        },
        wrist2: {
            type: Schema.Types.ObjectId,
            ref: 'ItemInstance'
        },
        weapon1: {
            type: Schema.Types.ObjectId,
            ref: 'ItemInstance'
        },
        weapon2: {
            type: Schema.Types.ObjectId,
            ref: 'ItemInstance'
        },               
    },
    affixes: [{
        type: affixSchema,
        default: () => ({})
    }],
});

const Character = model('Character', characterSchema);
export default Character;
