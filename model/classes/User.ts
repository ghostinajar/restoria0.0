// User
// Class and schema for User objects and documents
// Also allows state management for an active user instance
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import affixSchema, { IAffix } from "./Affix.js";
import itemSchema, { IItem } from "./Item.js";
import descriptionSchema, { IDescription } from "./Description.js";
import locationSchema, { ILocation } from "./Location.js";
import statBlockSchema, { IStatBlock } from "./StatBlock.js";
import IEquipped from "../../types/Equipped.js";
import historySchema, { IHistory } from "./History.js";
import catchErrorHandlerForFunction from "../../util/catchErrorHandlerForFunction.js";
import WORLD_RECALL from "../../constants/WORLD_RECALL.js";
import {
  calculateMaxHp,
  calculateMaxMp,
  calculateMaxMv,
} from "../../constants/BASE_STATS.js";

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

export interface IUser extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  name: string;
  password: string;
  salt: string;
  isAdmin: boolean;
  author: mongoose.Types.ObjectId | null;
  location: ILocation;
  pronouns: number;
  history: IHistory;
  hoursPlayed: number;
  job: string;
  level: number;
  statBlock: IStatBlock;
  goldHeld: number;
  goldBanked: number;
  trainingPoints: number;
  jobLevels: IJobLevels;
  description: IDescription;
  users: Array<mongoose.Types.ObjectId>;
  unpublishedZoneTally: number;
  trained: Array<ITrained>;
  inventory: Array<IItem>;
  capacity: number;
  storage: Array<IItem>;
  equipped: IEquipped;
  affixes: Array<IAffix>;
  editor: mongoose.Types.ObjectId | null;
  preferences: {
    autoExamine: boolean;
    mapRadius: number;
    autoMap: boolean;
  };
  _currentHp?: number;
  _currentMp?: number;
  _currentMv?: number;
  currentHp: number; // virtual
  maxHp: number; // virtual
  currentMp: number; // virtual
  maxMp: number; // virtual
  currentMv: number; // virtual
  maxMv: number; // virtual
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export const userSchema = new Schema<IUser>(
  {
    _id: Schema.Types.ObjectId,
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // as a salted hash
    salt: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    author: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    location: {
      type: locationSchema,
      required: true,
      default: WORLD_RECALL,
    },
    pronouns: { type: Number, required: true, default: 3 },
    history: { type: historySchema, required: true },
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
    description: {
      type: descriptionSchema,
      required: true,
      default: () => ({}),
    },
    users: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      required: true,
      default: () => [],
    },
    unpublishedZoneTally: { type: Number, required: true, default: 0 },
    trained: {
      type: [{ name: String, level: Number }],
      required: true,
      default: () => [],
    },
    inventory: { type: [itemSchema], required: true, default: () => [] },
    capacity: { type: Number, required: true, default: 30 },
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
    editor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    preferences: {
      type: {
        autoExamine: { type: Boolean, required: true, default: true },
        mapRadius: { type: Number, required: true, default: 8 },
        autoMap: { type: Boolean, required: true, default: true },
      },
      required: true,
      default: () => ({ autoExamine: false, mapRadius: 8, autoMap: true }),
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

userSchema
  .virtual("currentHp")
  .get(function () {
    return this._currentHp ?? calculateMaxHp(this);
  })
  .set(function (value: number) {
    this._currentHp = value;
  });

userSchema.virtual("maxHp").get(function () {
  return calculateMaxHp(this);
});

userSchema
  .virtual("currentMp")
  .get(function () {
    return this._currentMp ?? calculateMaxMp(this);
  })
  .set(function (value: number) {
    this._currentMp = value;
  });

userSchema.virtual("maxMp").get(function () {
  return calculateMaxMp(this);
});

userSchema
  .virtual("currentMv")
  .get(function () {
    return this._currentMv ?? calculateMaxMv(this);
  })
  .set(function (value: number) {
    this._currentMv = value;
  });

userSchema.virtual("maxMv").get(function () {
  return calculateMaxMv(this);
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error: unknown) {
    catchErrorHandlerForFunction(
      `User.comparePassword for user id ${this._id}`,
      error
    );
  }
};

const User = model<IUser>("User", userSchema);
export default User;
