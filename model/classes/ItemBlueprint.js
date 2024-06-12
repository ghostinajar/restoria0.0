import mongoose from 'mongoose';
import historySchema from './History.js';
import descriptionSchema from './Description.js';
import affixSchema from './Affix.js';
import itemNodeSchema from './ItemNode.js';
const { Schema } = mongoose;
/*Only mobs and items have blueprints, and only because multiple instances
of them will exist in game simultaneously, and they can't all share the same id.
If you change properties in itemBlueprintSchema, please also update itemSchema
*/
const itemBlueprintSchema = new Schema({
    _id: Schema.Types.ObjectId,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    name: String,
    itemType: String,
    price: {
        type: Number,
        default: 0
    },
    capacity: Number,
    levelRestriction: Number,
    history: {
        type: historySchema,
        default: () => ({})
    },
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
        spellName: String,
        level: Number,
        maxCharges: Number
    },
    tags: [String],
    keywords: [String],
    wearableLocations: [String],
    affixes: [{
            type: affixSchema,
            default: () => ({})
        }],
    tweakDuration: {
        type: Number,
        default: 182,
    },
    itemNodes: [{
            type: itemNodeSchema,
            default: () => ({})
        }],
});
export default itemBlueprintSchema;
