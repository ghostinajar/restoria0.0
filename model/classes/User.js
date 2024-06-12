// User
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import affixSchema from "./Affix.js";
import itemSchema from "./Item.js";
import descriptionSchema from "./Description.js";
import locationSchema from "./Location.js";
import statBlockSchema from "./StatBlock.js";
const { Schema, Types, model } = mongoose;
const userSchema = new Schema({
    _id: Schema.Types.ObjectId,
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // as a salted hash
    salt: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    isTeacher: { type: Boolean, required: true, default: false },
    isAuthor: { type: Boolean, required: true, default: false },
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
userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    }
    catch (err) {
        throw err;
    }
};
const User = model("User", userSchema);
export default User;
