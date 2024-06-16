import mongoose from 'mongoose';
import descriptionSchema from './Description.js';
import affixSchema from './Affix.js';
const { Schema } = mongoose;
;
;
const itemSchema = new Schema({
    _id: Schema.Types.ObjectId,
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
        default: function () {
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
});
itemSchema.add({
    inventory: {
        type: [itemSchema],
        default: []
    }
});
export default itemSchema;
