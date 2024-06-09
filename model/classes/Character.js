// Character.ts
import mongoose from "mongoose";
import descriptionSchema from "./Description.js";
import affixSchema from "./Affix.js";
import statBlockSchema from "./StatBlock.js";
import locationSchema from "./Location.js";
import itemSchema from "./Item.js";
const { Schema } = mongoose;
const characterSchema = new Schema({
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
