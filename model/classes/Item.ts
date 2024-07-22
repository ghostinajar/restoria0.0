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
    dagger: boolean;
    fixture: boolean;
    food: boolean;
    guild: boolean;
    hidden: boolean;
    illuminates: boolean; //lights up the room
    light: boolean; //can be equipped by players with a light aura
    mage: boolean;
    neutral: boolean;
    quest: boolean;
    offhand: boolean;
    reach: boolean;
    temporary: boolean;
    rogue: boolean;
    thrown: boolean;
    two_hand: boolean;
    warrior: boolean;
  };
  keywords: Array<string>;
  wearableLocations: Array<string>;
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
    isRanged: Boolean,
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
