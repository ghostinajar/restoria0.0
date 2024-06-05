import mongoose from 'mongoose';
import descriptionSchema from './Description.js';
import affixSchema from './Affix.js';

const { Schema } = mongoose;

/* each item's properties are duplicated to avoid having to query
dozens of zones in db to get their data when a character logs in.
This way it can  persist even if its zone/blueprint is deleted.
Items are saved as subdocuments in a character document, either
    -as a property of a character's worn location slot
    -in the inventory or storage array
because mongodb says Data used together should be stored together,
(items are only ever loaded/saved from db attached to a character).
*/

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
        type: [Schema.Types.Mixed],
        default: []
    }
});

export default itemSchema;