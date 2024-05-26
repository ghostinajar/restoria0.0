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
    default: {
        inZone: '664f8ca70cc5ae9b173969a8',
        inRoom: '66516e71db5355ed8ff39f59',
        }
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
          ref: 'Item'
        },
        default: {}
    },
    equipped: {
        arms: {
            type: Schema.Types.ObjectId,
            ref: 'Item',
            default: null
        },
        body: {
            type: Schema.Types.ObjectId,
            ref: 'Item',
            default: null
        },
        ears: {
            type: Schema.Types.ObjectId,
            ref: 'Item',
            default: null
        },
        feet: {
            type: Schema.Types.ObjectId,
            ref: 'Item',
            default: null
        },
        finger1: {
            type: Schema.Types.ObjectId,
            ref: 'Item',
            default: null
        },
        finger2: {
            type: Schema.Types.ObjectId,
            ref: 'Item',
            default: null
        },
        hands: {
            type: Schema.Types.ObjectId,
            ref: 'Item',
            default: null
        },
        head: {
            type: Schema.Types.ObjectId,
            ref: 'Item',
            default: null
        },
        held: {
            type: Schema.Types.ObjectId,
            ref: 'Item',
            default: null
        },
        legs: {
            type: Schema.Types.ObjectId,
            ref: 'Item',
            default: null
        },
        neck: {
            type: Schema.Types.ObjectId,
            ref: 'Item',
            default: null
        },
        shield: {
            type: Schema.Types.ObjectId,
            ref: 'Item',
            default: null
        },
        shoulders: {
            type: Schema.Types.ObjectId,
            ref: 'Item',
            default: null
        },
        waist: {
            type: Schema.Types.ObjectId,
            ref: 'Item',
            default: null
        },
        wrist1: {
            type: Schema.Types.ObjectId,
            ref: 'Item',
            default: null
        },
        wrist2: {
            type: Schema.Types.ObjectId,
            ref: 'Item',
            default: null
        },
        weapon1: {
            type: Schema.Types.ObjectId,
            ref: 'Item',
            default: null
        },
        weapon2: {
            type: Schema.Types.ObjectId,
            ref: 'Item',
            default: null
        },               
    },
    affixes: [{
        type: affixSchema,
        default: () => ({})
    }],
});

//TODO add loadInventory method, and clearContents method for garbage collection

const Character = model('Character', characterSchema);
export default Character;
