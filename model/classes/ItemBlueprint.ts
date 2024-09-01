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
    mage: boolean;
    rogue: boolean;
    warrior: boolean;
    dark: boolean;
    neutral: boolean;
    light: boolean; //can be equipped by players with a light aura
    guild: boolean;
    food: boolean;
    lamp: boolean; //lights up the room
    hidden: boolean;
    fixture: boolean;
    quest: boolean;
    temporary: boolean;
    container: boolean;
  };
  keywords: Array<string>;
  wearableLocations?: {
    head: boolean;
    ears: boolean;
    neck: boolean;
    shoulders: boolean;
    body: boolean;
    arms: boolean;
    wrist1: boolean;
    wrist2: boolean;
    hands: boolean;
    finger1: boolean;
    finger2: boolean;
    waist: boolean;
    legs: boolean;
    feet: boolean;
    shield: boolean;
  };
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
    cleric: {
      type: Boolean,
      default: true,
    },
    mage: {
      type: Boolean,
      default: false,
    },
    rogue: {
      type: Boolean,
      default: false,
    },
    warrior: {
      type: Boolean,
      default: false,
    },
    dark: {
      type: Boolean,
      default: true,
    },
    neutral: {
      type: Boolean,
      default: false,
    },
    light: {
      type: Boolean,
      default: false,
    }, //can be equipped by players with a light aura
    guild: {
      type: Boolean,
      default: false,
    },
    food: {
      type: Boolean,
      default: true,
    },
    lamp: {
      type: Boolean,
      default: false,
    }, //lights up the room
    hidden: {
      type: Boolean,
      default: false,
    },
    fixture: {
      type: Boolean,
      default: true,
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
      default: true,
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
