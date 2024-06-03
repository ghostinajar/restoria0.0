import mongoose from 'mongoose';
import descriptionSchema from './Description.js';
import affixSchema from './Affix.js';
import statBlockSchema from './StatBlock.js';
import locationSchema from './Location.js';

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
    inventory: [{
          type: Schema.Types.ObjectId,
          ref: 'Item'
        }],
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

characterSchema.pre('save', function(next) {
    this.name = this.displayName.toLowerCase();
    next();
});
  
characterSchema.pre('findOneAndUpdate', function(next) {
    this._update.name = this._update.displayName.toLowerCase();
    next();
});

characterSchema.methods.addItem = function(item) {
    this.inventory.set(item._id.toString(), item._id);
};

characterSchema.methods.removeItem = function(itemId) {
    this.inventory.delete(itemId.toString());
};

//TODO add loadInventory method, and clearContents method for garbage collection

export default characterSchema;
