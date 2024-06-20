// Item
import mongoose from "mongoose";
import descriptionSchema, { IDescription } from "./Description.js";
import affixSchema, { IAffix } from "./Affix.js";

const { Schema } = mongoose;

// Each item's properties are duplicated to avoid having to query
// dozens of zones in db to get their data when a character logs in.
// This way it can persist even if its zone/blueprint is deleted.
// Items are saved as subdocuments in a character document, either
//     -as a property of a character's worn location slot
//     -in the inventory or storage array
// because mongodb says Data used together should be stored together,
// (items are only ever loaded/saved from db attached to a character).

export interface IWeaponStats {
  damageDieSides: number;
  damageDieQuantity: number;
  damageType: string;
  isRanged: boolean;
}

export interface ISpellCharges {
  name: string;
  level: number;
  maxCharges: number;
}

export interface IItem {
  _id: mongoose.Types.ObjectId;
  itemBlueprint: mongoose.Types.ObjectId;
  fromZone: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  name: string;
  itemType: string;
  price: number;
  capacity: number;
  levelRestriction: number;
  description: IDescription;
  weaponStats: IWeaponStats;
  spellCharges: ISpellCharges;
  tags: Array<string>;
  keywords: Array<string>;
  wearableLocations: Array<string>;
  creationDate: Date;
  expiryDate: Date;
  levelRestrictionTweak: number;
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
  levelRestriction: Number,
  description: {
    type: descriptionSchema,
    default: () => ({}),
  },
  weaponStats: {
    damageDieSides: Number,
    damageDieQuantity: Number,
    damageType: String,
    isRanged: Boolean,
  },
  spellCharges: {
    name: String,
    level: Number,
    maxCharges: Number,
  },
  tags: [String],
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
  levelRestrictionTweak: Number,
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
