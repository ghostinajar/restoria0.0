import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const itemInstanceSchema = new Schema({
    itemId: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Author'
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
    itemTags: [String],
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
    affixes: [
        {
            affix: String,
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