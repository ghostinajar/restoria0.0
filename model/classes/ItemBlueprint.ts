// ItemBlueprint
import mongoose from "mongoose";
import historySchema, { IHistory } from "./History.js";
import descriptionSchema, { IDescription } from "./Description.js";
import affixSchema, { IAffix } from "./Affix.js";
import itemNodeSchema, { IItemNode } from "./ItemNode.js";

const { Schema } = mongoose;

export interface IWeaponStats {
  damageDieSides: number;
  damageDieQuantity: number;
  damageType: string;
  isFinesse: boolean;
  isLight: boolean;
  isReach: boolean;
  isRanged: boolean;
  isTwohand: boolean;
}

export interface ISpellCharges {
  name: string;
  level: number;
  maxCharges: number;
}

export interface IItemBlueprint {
  _id: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  name: string;
  itemType: string;
  price: number;
  capacity: number;
  minimumLevel: number;
  history: IHistory;
  description: IDescription;
  weaponStats?: IWeaponStats;
  spellCharges?: ISpellCharges;
  tags: {
    cleric: boolean;
    container: boolean;
    dark: boolean;
    fixture: boolean;
    food: boolean;
    guild: boolean;
    hidden: boolean;
    illuminates: boolean; //lights up the room
    light: boolean; //can be equipped by players with a light aura
    mage: boolean;
    neutral: boolean;
    quest: boolean;
    temporary: boolean;
    rogue: boolean;
    warrior: boolean;
  };
  keywords: Array<string>;
  wearableLocations?: Array<string>;
  affixes?: Array<IAffix>;
  tweakDuration: number;
  itemNodes?: Array<IItemNode>;
}

/*Only mobs and items have blueprints, and only because multiple instances 
of them will exist in game simultaneously, and they can't all share the same id.
If you change properties in itemBlueprintSchema, please also update itemSchema
*/

const itemBlueprintSchema = new Schema<IItemBlueprint>({
  _id: Schema.Types.ObjectId,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
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
    cleric: Boolean,
    container: Boolean,
    dark: Boolean,
    fixture: Boolean,
    food: Boolean,
    guild: Boolean,
    hidden: Boolean,
    illuminates: Boolean, //lights up the room
    light: Boolean, //can be equipped by players with a light aura
    mage: Boolean,
    neutral: Boolean,
    quest: Boolean,
    temporary: Boolean,
    rogue: Boolean,
    warrior: Boolean,
  },
  keywords: [String],
  wearableLocations: [String],
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
