import mongoose from 'mongoose';

const { Schema } = mongoose;

const statBlockSchema = new Schema({
    strength: Number,
    dexterity: Number,
    constitution: Number,
    intelligence: Number,
    wisdom: Number,
    charisma: Number,
    spirit: Number,
});

export default statBlockSchema;