import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const itemInstanceSchema = new Schema({
    instanceOfItemId: String, //how to reference a specific item's ObjectId in the zones collection?
    author: {
        type: Schema.Types.ObjectId,
        ref: 'StoredUser'
    },
    name: String,
    itemType: String,
    price: Number,
    capacity: Number,
    levelRestriction: Number,
    description: {
        look: String,
        examine: String,
        study: String,
        research: String
    },
    weaponStats: {
        damageDieType: Number,
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
    affixes: [
        {
            affixType: String,
            value: Number,
            currentTweak: Number
        }
    ],
    inventory: [
        {
            type: Schema.Types.ObjectId,
            ref: 'ItemInstance'
        }
    ]
});

const ItemInstance = model('ItemInstance', itemInstanceSchema);
export default ItemInstance;