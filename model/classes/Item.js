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
        dark: Boolean,
        dagger: Boolean,
        fixture: Boolean,
        food: Boolean,
        guild: Boolean,
        hidden: Boolean,
        illuminates: Boolean, //lights up the room
        light: Boolean, //can be equipped by players with a light aura
        mage: Boolean,
        neutral: Boolean,
        quest: Boolean,
        offhand: Boolean,
        reach: Boolean,
        temporary: Boolean,
        rogue: Boolean,
        thrown: Boolean,
        two_hand: Boolean,
        warrior: Boolean,
    },
    keywords: [String],
    wearableLocations: [String],
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
