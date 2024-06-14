// User
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import affixSchema, { IAffix } from "./Affix.js";
import itemSchema, { IItem } from "./Item.js";
import descriptionSchema, { IDescription } from "./Description.js";
import locationSchema, { ILocation } from "./Location.js";
import statBlockSchema, { IStatBlock } from "./StatBlock.js";
import logger from "../../logger.js";

const { Schema, Types, model } = mongoose;
export interface IJobLevels {
  cleric: number;
  mage: number;
  rogue: number;
  warrior: number;
}

export interface ITrained {
  name: string;
  level: number;
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

export interface IUser {
  _id: mongoose.Types.ObjectId;
  username: string;
  name: string;
  password: string;
  salt: string;
  isAdmin: boolean;
  isTeacher: boolean;
  isAuthor: boolean;
  author: mongoose.Types.ObjectId | null;
  location: ILocation;
  pronouns: number;
  creationDate: Date;
  hoursPlayed: number;
  job: string;
  level: number;
  statBlock: IStatBlock;
  goldHeld: number;
  goldBanked: number;
  trainingPoints: number;
  jobLevels: IJobLevels;
  description: IDescription;
  characters: Array<mongoose.Types.ObjectId>;
  students?: Array<mongoose.Types.ObjectId>;
  //may change when training is implemented
  trained: Array<ITrained>;
  inventory: Array<IItem>;
  storage: Array<IItem>;
  equipped: IEquipped;
  affixes: Array<IAffix>;
}

const userSchema = new Schema<IUser>({
  _id: Schema.Types.ObjectId,
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // as a salted hash
  salt: { type: String, required: true },
  isAdmin: { type: Boolean, required: true, default: false },
  isTeacher: { type: Boolean, required: true, default: false },
  isAuthor: { type: Boolean, required: true, default: false },
  author: {
    type: Schema.Types.ObjectId,
    default: null,
  },
  location: {
    type: locationSchema,
    required: true,
    default: {
      inZone: new Types.ObjectId(process.env.WORLD_RECALL_ZONEID),
      inRoom: new Types.ObjectId(process.env.WORLD_RECALL_ROOMID),
    },
  },
  // 0 = he/him, 1 = it/it, 2 = she/her, 3 = they/them
  pronouns: { type: Number, required: true, default: 3 },
  creationDate: { type: Date, required: true, default: Date.now },
  hoursPlayed: { type: Number, required: true, default: 0 },
  job: { type: String, required: true, default: "cleric" },
  level: { type: Number, required: true, default: 1 },
  statBlock: { type: statBlockSchema, required: true, default: () => ({}) },
  goldHeld: { type: Number, required: true, default: 0 },
  goldBanked: { type: Number, required: true, default: 0 },
  trainingPoints: { type: Number, required: true, default: 0 },
  jobLevels: {
    type: {
      cleric: { type: Number, required: true, default: 0 },
      mage: { type: Number, required: true, default: 0 },
      rogue: { type: Number, required: true, default: 0 },
      warrior: { type: Number, required: true, default: 0 },
    },
    required: true,
  },
  description: { type: descriptionSchema, required: true, default: () => ({}) },
  characters: {
    type: [{ type: Schema.Types.ObjectId, ref: "User" }],
    required: true,
    default: () => [],
  },
  students: {
    type: [{ type: Schema.Types.ObjectId, ref: "User" }],
    required: true,
    default: () => [],
  },
  trained: {
    type: [{ name: String, level: Number }],
    required: true,
    default: () => [],
  },
  inventory: { type: [itemSchema], required: true, default: () => [] },
  storage: { type: [itemSchema], required: true, default: () => [] },
  equipped: {
    type: {
      arms: { type: itemSchema, default: null },
      body: { type: itemSchema, default: null },
      ears: { type: itemSchema, default: null },
      feet: { type: itemSchema, default: null },
      finger1: { type: itemSchema, default: null },
      finger2: { type: itemSchema, default: null },
      hands: { type: itemSchema, default: null },
      head: { type: itemSchema, default: null },
      held: { type: itemSchema, default: null },
      legs: { type: itemSchema, default: null },
      neck: { type: itemSchema, default: null },
      shield: { type: itemSchema, default: null },
      shoulders: { type: itemSchema, default: null },
      waist: { type: itemSchema, default: null },
      wrist1: { type: itemSchema, default: null },
      wrist2: { type: itemSchema, default: null },
      weapon1: { type: itemSchema, default: null },
      weapon2: { type: itemSchema, default: null },
    },
    required: true,
  },
  affixes: {
    type: [{ type: affixSchema, required: true, default: () => ({}) }],
    required: true,
    default: () => [],
  },
});

userSchema.methods.comparePassword = async function (candidatePassword: string) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (err) {
    throw err; 
  }
};

const User = model<IUser>("User", userSchema);
export default User;
