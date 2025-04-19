// ItemBlueprint
import mongoose from "mongoose";
import historySchema from "./History.js";
import descriptionSchema from "./Description.js";
import affixSchema from "./Affix.js";
import itemNodeSchema from "./ItemNode.js";
const { Schema } = mongoose;
/*Only mobs and items have blueprints, and only because multiple instances
of them will exist in game simultaneously, and they can't all share the same id.
If you change properties in itemBlueprintSchema, please also update itemSchema
*/
const itemBlueprintSchema = new Schema({
    _id: Schema.Types.ObjectId,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    fromZone: {
        type: Schema.Types.ObjectId,
        ref: "Zone",
    },
    name: String,
    itemType: String,
    price: {
        type: Number,
        default: 0,
    },
    capacity: Number,
    minimumLevel: Number,
    history: {
        type: historySchema,
        default: () => ({}),
    },
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
        cleric: {
            type: Boolean,
            default: true,
        },
        mage: {
            type: Boolean,
            default: true,
        },
        rogue: {
            type: Boolean,
            default: true,
        },
        warrior: {
            type: Boolean,
            default: true,
        },
        moon: {
            type: Boolean,
            default: true,
        },
        neutral: {
            type: Boolean,
            default: true,
        },
        sun: {
            type: Boolean,
            default: true,
        },
        guild: {
            type: Boolean,
            default: false,
        },
        food: {
            type: Boolean,
            default: false,
        },
        lamp: {
            type: Boolean,
            default: false,
        },
        hidden: {
            type: Boolean,
            default: false,
        },
        fixture: {
            type: Boolean,
            default: false,
        },
        quest: {
            type: Boolean,
            default: false,
        },
        temporary: {
            type: Boolean,
            default: false,
        },
        container: {
            type: Boolean,
            default: false,
        },
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
    affixes: [
        {
            type: affixSchema,
            default: () => ({}),
        },
    ],
    tweakDuration: {
        type: Number,
        default: 182,
    },
    itemNodes: [
        {
            type: itemNodeSchema,
            default: () => ({}),
        },
    ],
});
export default itemBlueprintSchema;
