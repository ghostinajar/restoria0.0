import mongoose from 'mongoose';
import historySchema from './History.js';
import descriptionSchema from './Description.js';
import affixSchema from './Affix.js';
import itemNodeSchema from './ItemNode.js';

const { Schema } = mongoose;

//itemInstance properties are duplicated so they can be loaded without having to query
//dozens of zones in db to get each itemInstance's item properties when a character 
//enters the game. If you change itemSchema, please also make the change to 
//itemInstanceSchema

const itemSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    name: String,
    itemType: String,
    price: {
        type: Number,
        default: 0
    },
    capacity: Number,
    levelRestriction: Number,
    history: {
        type: historySchema,
        default: () => ({})
    },
    description: {
        type: descriptionSchema,
        default: () => ({})
    },
    weaponStats: {
        damageDieSides: Number,
        damageDieQuantity: Number,
        damageType: String,
        isRanged: Boolean
    },
    spellCharges: {
        spellName: String,
        level: Number,
        maxCharges: Number
    },
    tags: [String],
    keywords: [String],
    wearableLocations: [String],
    affixes: [{
        type: affixSchema,
        default: () => ({})
    }],
    tweakDuration: {
        type: Number,
        default: 182,
    }, 
    itemNodes: [{
        type: itemNodeSchema,
        default: () => ({})
    }],
});

export default itemSchema;