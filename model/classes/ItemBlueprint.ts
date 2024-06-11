import mongoose from 'mongoose';
import historySchema, { IHistory } from './History.js';
import descriptionSchema, { IDescription } from './Description.js';
import affixSchema, { IAffix } from './Affix.js';
import itemNodeSchema, { IItemNode } from './ItemNode.js';
import { ISpellCharges, IWeaponStats } from './Item.js';

const { Schema } = mongoose;

export interface IItemBlueprint {
    author: mongoose.Schema.Types.ObjectId;
    name: string;
    itemType: string;
    price: number;
    capacity: number;
    levelRestriction: number;
    history: IHistory;
    description: IDescription;
    weaponStats: IWeaponStats;
    spellCharges: ISpellCharges;
    tags: Array<string>;
    keywords: Array<string>;
    wearableLocations: Array<string>;
    affixes: Array<IAffix>;
    tweakDuration: number;
    itemNodes: Array<IItemNode>;
}

/*Only mobs and items have blueprints, and only because multiple instances 
of them will exist in game simultaneously, and they can't all share the same id.
If you change properties in itemBlueprintSchema, please also update itemSchema
*/

const itemBlueprintSchema = new Schema<IItemBlueprint>({
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