import mongoose from 'mongoose';

const { Schema } = mongoose;

const statBlockSchema = new Schema({
    strength: { 
        type: Number,
        default: 10,
        min: [12, 'The value of `{PATH}` (`{VALUE}`) is beneath the limit of `{MIN}`.'],
        max: [18, 'The value of `{PATH}` (`{VALUE}`) exceeds the limit of `{MAX}`.']
    },
    dexterity: { 
        type: Number,
        default: 10,
        min: [12, 'The value of `{PATH}` (`{VALUE}`) is beneath the limit of `{MIN}`.'],
        max: [18, 'The value of `{PATH}` (`{VALUE}`) exceeds the limit of `{MAX}`.']
    },
    constitution: { 
        type: Number,
        default: 10,
        min: [12, 'The value of `{PATH}` (`{VALUE}`) is beneath the limit of `{MIN}`.'],
        max: [18, 'The value of `{PATH}` (`{VALUE}`) exceeds the limit of `{MAX}`.']
    },
    intelligence: { 
        type: Number,
        default: 10,
        min: [12, 'The value of `{PATH}` (`{VALUE}`) is beneath the limit of `{MIN}`.'],
        max: [18, 'The value of `{PATH}` (`{VALUE}`) exceeds the limit of `{MAX}`.']
    },
    wisdom: { 
        type: Number,
        default: 10,
        min: [12, 'The value of `{PATH}` (`{VALUE}`) is beneath the limit of `{MIN}`.'],
        max: [18, 'The value of `{PATH}` (`{VALUE}`) exceeds the limit of `{MAX}`.']
    },
    charisma: { 
        type: Number,
        default: 10,
        min: [12, 'The value of `{PATH}` (`{VALUE}`) is beneath the limit of `{MIN}`.'],
        max: [18, 'The value of `{PATH}` (`{VALUE}`) exceeds the limit of `{MAX}`.']
    },
    spirit: { 
        type: Number,
        default: 0,
        min: [-1000, 'The value of `{PATH}` (`{VALUE}`) is beneath the limit of `{MIN}`.'],
        max: [1000, 'The value of `{PATH}` (`{VALUE}`) exceeds the limit of `{MAX}`.']
    },
}, { _id: false });

export default statBlockSchema;