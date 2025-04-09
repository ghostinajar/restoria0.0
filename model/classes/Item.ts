// Item
import mongoose from "mongoose";
import descriptionSchema, { IDescription } from "./Description.js";
import affixSchema, { IAffix } from "./Affix.js";
import { ISpellCharges, IWeaponStats } from "./ItemBlueprint.js";

const { Schema } = mongoose;

// Each item's properties are duplicated to avoid having to query
// dozens of zones in db to get their data when a user logs in.
// This way it can persist even if its zone/blueprint is deleted.
// Items are saved as subdocuments in a user document, either
//     -as a property of a user's worn location slot
//     -in the inventory or storage array
// because mongodb says Data used together should be stored together,
// (items are only ever loaded/saved from db attached to a user).

export interface IItem {
  _id: mongoose.Types.ObjectId;
  itemBlueprint: mongoose.Types.ObjectId;
  fromZone: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  name: string;
  itemType: string;
  price: number;
  capacity: number;
  minimumLevel: number;
  description: IDescription;
  weaponStats: IWeaponStats;
  spellCharges: ISpellCharges;
  tags: {
    cleric: boolean;
    container: boolean;
    dark: boolean;
    fixture: boolean;
    food: boolean;
    guild: boolean;
    hidden: boolean;
    lamp: boolean; //lights up the room
    light: boolean; //can be equipped by players with a light aura
    mage: boolean;
    neutral: boolean;
    quest: boolean;
    temporary: boolean;
    rogue: boolean;
    warrior: boolean;
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
  creationDate: Date;
  expiryDate: Date;
  minimumLevelTweak: number;
  isInStorage: boolean;
  spellChargesRemaining: number;
  isIdentified: boolean;
  isPrecious: boolean;
  dubCode: string;
  affixes: Array<IAffix>;
  inventory?: Array<IItem>;
}

const itemSchema = new Schema<IItem>({
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
    fixture: Boolean,
    food: Boolean,
    guild: Boolean,
    hidden: Boolean,
    lamp: Boolean, //lights up the room
    light: Boolean, //can be equipped by players with a light aura
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
