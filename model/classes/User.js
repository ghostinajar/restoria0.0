// User
// Class and schema for User objects and documents
// Also allows state management for an active user instance
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import affixSchema from "./Affix.js";
import itemSchema from "./Item.js";
import descriptionSchema from "./Description.js";
import locationSchema from "./Location.js";
import statBlockSchema from "./StatBlock.js";
import historySchema from "./History.js";
import catchErrorHandlerForFunction from "../../util/catchErrorHandlerForFunction.js";
import WORLD_RECALL from "../../constants/WORLD_RECALL.js";
const { Schema, Types, model } = mongoose;
export const userSchema = new Schema({
    _id: Schema.Types.ObjectId,
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // as a salted hash
    salt: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    isTeacher: { type: Boolean, required: true, default: false },
    author: {
        type: Schema.Types.ObjectId,
        default: null,
    },
    location: {
        type: locationSchema,
        required: true,
        default: WORLD_RECALL,
    },
    // 0 = he/him, 1 = it/it, 2 = she/her, 3 = they/them
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
    description: { type: descriptionSchema, required: true, default: () => ({}) },
    users: {
        type: [{ type: Schema.Types.ObjectId, ref: "User" }],
        required: true,
        default: () => [],
    },
    students: {
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
        default: () => ({ autoExamine: false, mapRadius: 8, autoMap: true, }),
    }
});
userSchema.pre("save", function (next) {
    // Prevent runtimeProps from being stored in DB
    // Temporarily store the runtimeProps to restore after saving
    const runtimeProps = this.runtimeProps;
    this.runtimeProps = undefined;
    next();
    this.runtimeProps = runtimeProps;
});
userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    }
    catch (error) {
        catchErrorHandlerForFunction(`User.comparePassword for user id ${this._id}`, error);
    }
};
userSchema.methods.calculateMaxHp = function () {
    try {
        // Implement your logic to calculate max Hp
        let maxHp = 10; // Base HP
        maxHp += ((this.statBlock.constitution - 10) / 2) * this.level; // Add constitution bonus * level
        if (this.job === "cleric") {
            maxHp += this.level * 10; // Increase by level
        }
        if (this.job === "mage") {
            maxHp += this.level * 8; // Increase by level
        }
        if (this.job === "thief") {
            maxHp += this.level * 10; // Increase by level
        }
        if (this.job === "warrior") {
            maxHp += this.level * 12; // Increase by level
        }
        // TODO Add HP from equipped items
        return maxHp;
    }
    catch (error) {
        catchErrorHandlerForFunction(`User.calculateMaxHp`, error, this.name);
    }
};
userSchema.methods.calculateMaxMp = function () {
    try {
        // Implement your logic to calculate max Hp
        let maxMp = 10; // Base Hp
        if (this.job === "cleric") {
            maxMp += this.level * 10; // Increase by level
            maxMp += (this.statBlock.wisdom - 10) * this.level; // Add wisdom bonus * level
        }
        if (this.job === "mage") {
            maxMp += this.level * 12; // Increase by level
            maxMp += (this.statBlock.intelligence - 10) * this.level; // Add intelligence bonus * level
        }
        if (this.job === "thief") {
            maxMp += this.level * 10; // Increase by level
        }
        if (this.job === "warrior") {
            maxMp += this.level * 8; // Increase by level
        }
        // Add Mp from equipped items
        return maxMp;
    }
    catch (error) {
        catchErrorHandlerForFunction(`User.calculateMaxMp`, error, this.name);
    }
};
userSchema.methods.calculateMaxMv = function () {
    try {
        let MaxMv = 10; // Base Mv
        MaxMv += this.level * 10; // Increase by level
        MaxMv += ((this.statBlock.constitution - 10) / 2) * this.level; // Add constitution bonus * level
        // TODO Add Mv from equipped items
        return MaxMv;
    }
    catch (error) {
        catchErrorHandlerForFunction(`User.calculateMaxMv`, error, this.name);
    }
};
const User = model("User", userSchema);
export default User;
