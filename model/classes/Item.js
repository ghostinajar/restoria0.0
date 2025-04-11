// Item
import mongoose from "mongoose";
import descriptionSchema from "./Description.js";
import affixSchema from "./Affix.js";
const { Schema } = mongoose;
const itemSchema = new Schema({
    _id: Schema.Types.ObjectId,
    itemBlueprint: {
        type: Schema.Types.ObjectId,
        ref: "ItemBlueprint",
    },
    fromZone: {
        type: Schema.Types.ObjectId,
        ref: "Zone",
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    name: String,
    itemType: String,
    price: Number,
    capacity: Number,
    minimumLevel: Number,
    description: {
        type: descriptionSchema,
        default: () => ({}),
    },
    weaponStats: {
        damageDieSides: Number,
        damageDieQuantity: Number,
        damageType: String,
        isFinesse: Boolean,
        isLight: Boolean,
        isReach: Boolean,
        isRanged: Boolean,
        isTwohand: Boolean,
    },
    spellCharges: {
        name: String,
        level: Number,
        maxCharges: Number,
    },
    tags: {
        cleric: Boolean,
        container: Boolean,
        moon: Boolean,
        fixture: Boolean,
        food: Boolean,
        guild: Boolean,
        hidden: Boolean,
        lamp: Boolean,
        sun: Boolean,
        mage: Boolean,
        neutral: Boolean,
        quest: Boolean,
        temporary: Boolean,
        rogue: Boolean,
        warrior: Boolean,
    },
    keywords: [String],
    wearableLocations: {
        head: {
            type: Boolean,
            default: false,
        },
        ears: {
            type: Boolean,
            default: false,
        },
        neck: {
            type: Boolean,
            default: false,
        },
        shoulders: {
            type: Boolean,
            default: false,
        },
        body: {
            type: Boolean,
            default: false,
        },
        arms: {
            type: Boolean,
            default: false,
        },
        wrist1: {
            type: Boolean,
            default: false,
        },
        wrist2: {
            type: Boolean,
            default: false,
        },
        hands: {
            type: Boolean,
            default: false,
        },
        finger1: {
            type: Boolean,
            default: false,
        },
        finger2: {
            type: Boolean,
            default: false,
        },
        waist: {
            type: Boolean,
            default: false,
        },
        legs: {
            type: Boolean,
            default: false,
        },
        feet: {
            type: Boolean,
            default: false,
        },
        shield: {
            type: Boolean,
            default: false,
        },
    },
    creationDate: {
        type: Date,
        default: Date.now,
    },
    expiryDate: {
        type: Date,
        default: function () {
            return Date.now() + 1000 * 60 * 60 * 24 * 180;
        },
    },
    minimumLevelTweak: Number,
    isInStorage: Boolean,
    spellChargesRemaining: Number,
    isIdentified: Boolean,
    isPrecious: Boolean,
    dubCode: {
        type: String,
        maxLength: 10,
    },
    affixes: [
        {
            type: affixSchema,
            default: () => ({}),
        },
    ],
});
itemSchema.add({
    inventory: {
        type: [itemSchema],
        default: [],
    },
});
export default itemSchema;
