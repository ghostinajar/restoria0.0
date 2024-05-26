import mongoose from 'mongoose';
import descriptionSchema from './Description.js';
import affixSchema from './Affix.js';

const { Schema, model } = mongoose;

//each item's properties are duplicated so they can be loaded without having to query
//dozens of zones in db to get the itemBlueprint when a character logs in
//Items have their own collection in db because there will be thousands and thousands
//and they need to change location quickly and often

const itemSchema = new Schema({
    itemBlueprint: {
        type: Schema.Types.ObjectId,
        ref: 'ItemBlueprint'
    },
    fromZone: {
        type: Schema.Types.ObjectId,
        ref: 'Zone'
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    name: String,
    itemType: String,
    price: Number,
    capacity: Number,
    levelRestriction: Number,
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
        name: String,
        level: Number,
        maxCharges: Number
    },
    tags: [String],
    keywords: [String],
    wearableLocations: [String],
    creationDate: {
        type: Date,
        default: Date.now
    },
    expiryDate: {
        type: Date,
        default: function() {
            return Date.now() + 1000 * 60 * 60 * 24 * 180;
        },
    },
    levelRestrictionTweak: Number,
    isInStorage: Boolean,
    spellChargesRemaining: Number,
    isIdentified: Boolean,
    isPrecious: Boolean,
    dubCode: { 
        type: String, 
        maxLength: 10 
    },
    affixes: [{
        type: affixSchema,
        default: () => ({})
    }],
    inventory: {
        type: Map,
        of: {
          type: Schema.Types.ObjectId,
          ref: 'Item'
        }
    },
});

const Item = model('Item', itemSchema);
export default Item;