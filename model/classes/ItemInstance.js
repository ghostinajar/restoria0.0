import mongoose from 'mongoose';
import descriptionSchema from './Description.js';
import affixSchema from './Affix.js';

const { Schema, model } = mongoose;

//itemInstance properties are duplicated so they can be loaded without having to query
//dozens of zones in db to get each itemInstance's item properties when a character 
//enters the game

const itemInstanceSchema = new Schema({
    instanceOfItemId: String, // how can we reference an Item's ObjectId, which would be embedded in a zone?
    author: {
        type: Schema.Types.ObjectId,
        ref: 'UserUser'
    },
    name: String,
    itemType: String,
    price: Number,
    capacity: Number,
    levelRestriction: Number,
    description: descriptionSchema,
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
    affixes: [affixSchema],
    inventory: [
        {
            type: Schema.Types.ObjectId,
            ref: 'ItemInstance'
        }
    ]
});

const ItemInstance = model('ItemInstance', itemInstanceSchema);
export default ItemInstance;