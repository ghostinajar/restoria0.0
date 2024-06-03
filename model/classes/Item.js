import mongoose from 'mongoose';
import descriptionSchema from './Description.js';
import affixSchema from './Affix.js';
import ITEM_TYPE from '../../constants/ITEM_TYPE.js';

const { Schema, model } = mongoose;

//each item's properties are duplicated to avoid having to query
//dozens of zones in db to get their data when a character logs in.
//This way they can also persist even if a zone or its itemBlueprints are deleted.
//Items have their own collection in db because:
//-mongodb says Data used together should be stored together (character and its inventory)
//-there will be thousands and thousands
//-and they need to change location quickly and often

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
    inventory: [{
          type: Schema.Types.ObjectId,
          ref: 'Item'
        }]
});

itemSchema.methods.addItem = function(item) {
    if (this.itemType = ITEM_TYPE.CONTAINER) {
        this.inventory.set(item._id.toString(), item._id);
        return true
    } else {return false;}
};

itemSchema.methods.removeItem = function(itemId) {
    if (this.itemType = ITEM_TYPE.CONTAINER) {
        this.inventory.delete(itemId.toString());
        return true
    } else {return false;}
};

const Item = model('Item', itemSchema);
export default Item;