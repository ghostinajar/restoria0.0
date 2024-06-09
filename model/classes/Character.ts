// Character

import mongoose from "mongoose";
import descriptionSchema, { IDescription } from "./Description.js";
import affixSchema, { IAffix } from "./Affix.js";
import statBlockSchema, { IStatBlock } from "./StatBlock.js";
import locationSchema, { ILocation } from "./Location.js";
import itemSchema, { IItem } from "./Item.js";

const { Schema } = mongoose;

export interface IJobLevels {
  cleric: number;
  mage: number;
  thief: number;
  warrior: number;
}

export interface ITrainedProp {
  name: string;
  level: number;
}

export interface ITrained {
  passives: Array<ITrainedProp>;
  spells: Array<ITrainedProp>;
}

export interface IEquipped {
  arms: IItem | null;
  body: IItem | null;
  ears: IItem | null;
  feet: IItem | null;
  finger1: IItem | null;
  finger2: IItem | null;
  hands: IItem | null;
  head: IItem | null;
  held: IItem | null;
  legs: IItem | null;
  neck: IItem | null;
  shield: IItem | null;
  shoulders: IItem | null;
  waist: IItem | null;
  wrist1: IItem | null;
  wrist2: IItem | null;
  weapon1: IItem | null;
  weapon2: IItem | null;
}

export interface ICharacter {
  name: string;
  displayName: string;
  pronouns: number;
  location: ILocation;
  creationDate: Date;
  hoursPlayed: number;
  job: string;
  statBlock: IStatBlock;
  goldHeld: number;
  goldBanked: number;
  trainingPoints: number;
  jobLevels: IJobLevels;
  description: IDescription;
  //may change when training is implemented
  trained?: ITrained;
  inventory: Array<IItem>;
  storage: Array<IItem>;
  equipped: IEquipped;
  affixes: Array<IAffix>;
}

const characterSchema = new Schema<ICharacter>({
  name: { type: String, required: true, unique: true },
  displayName: { type: String, required: true, unique: true },
  // 0 = he/him, 1 = it/it, 2 = she/her, 3 = they/them
  pronouns: { type: Number, required: true, default: 3 },
  location: {
    type: locationSchema,
    required: true,
    default: () => ({}),
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
  hoursPlayed: Number,
  job: { type: String, required: true, default: "cleric" },
  statBlock: {
    type: statBlockSchema,
    required: true,
    default: () => ({}),
  },
  goldHeld: { type: Number, required: true, default: 0 },
  goldBanked: { type: Number, required: true, default: 0 },
  trainingPoints: { type: Number, required: true, default: 0 },
  jobLevels: {
    cleric: { type: Number, required: true, default: 0 },
    mage: { type: Number, required: true, default: 0 },
    thief: { type: Number, required: true, default: 0 },
    warrior: { type: Number, required: true, default: 0 },
  },
  description: {
    type: descriptionSchema,
    required: true,
    default: () => ({}),
  },
  //may change when training is implemented
  trained: {
    passives: [{ name: String, level: Number }],
    spells: [{ name: String, level: Number }],
  },
  inventory: { type: [itemSchema], required: true, default: () => [] },
  storage: { type: [itemSchema], required: true, default: () => [] },
  equipped: {
    arms: { type: itemSchema, required: true, default: null },
    body: { type: itemSchema, required: true, default: null },
    ears: { type: itemSchema, required: true, default: null },
    feet: { type: itemSchema, required: true, default: null },
    finger1: { type: itemSchema, required: true, default: null },
    finger2: { type: itemSchema, required: true, default: null },
    hands: { type: itemSchema, required: true, default: null },
    head: { type: itemSchema, required: true, default: null },
    held: { type: itemSchema, required: true, default: null },
    legs: { type: itemSchema, required: true, default: null },
    neck: { type: itemSchema, required: true, default: null },
    shield: { type: itemSchema, required: true, default: null },
    shoulders: { type: itemSchema, required: true, default: null },
    waist: { type: itemSchema, required: true, default: null },
    wrist1: { type: itemSchema, required: true, default: null },
    wrist2: { type: itemSchema, required: true, default: null },
    weapon1: { type: itemSchema, required: true, default: null },
    weapon2: { type: itemSchema, required: true, default: null },
  },
  affixes: [{ type: affixSchema, required: true, default: () => ({}) }],
});

export default characterSchema;
