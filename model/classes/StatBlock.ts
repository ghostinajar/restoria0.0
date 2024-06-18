import mongoose from 'mongoose';

const { Schema } = mongoose;

export interface IStatBlock {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
    spirit: number;
};

const statBlockSchema = new Schema<IStatBlock>({
    strength: { 
        type: Number,
        default: 12,
        min: [4, 'The value of `{PATH}` (`{VALUE}`) is beneath the limit of `{MIN}`.'],
        max: [18, 'The value of `{PATH}` (`{VALUE}`) exceeds the limit of `{MAX}`.']
    },
    dexterity: { 
        type: Number,
        default: 12,
        min: [4, 'The value of `{PATH}` (`{VALUE}`) is beneath the limit of `{MIN}`.'],
        max: [18, 'The value of `{PATH}` (`{VALUE}`) exceeds the limit of `{MAX}`.']
    },
    constitution: { 
        type: Number,
        default: 12,
        min: [4, 'The value of `{PATH}` (`{VALUE}`) is beneath the limit of `{MIN}`.'],
        max: [18, 'The value of `{PATH}` (`{VALUE}`) exceeds the limit of `{MAX}`.']
    },
    intelligence: { 
        type: Number,
        default: 12,
        min: [4, 'The value of `{PATH}` (`{VALUE}`) is beneath the limit of `{MIN}`.'],
        max: [18, 'The value of `{PATH}` (`{VALUE}`) exceeds the limit of `{MAX}`.']
    },
    wisdom: { 
        type: Number,
        default: 12,
        min: [4, 'The value of `{PATH}` (`{VALUE}`) is beneath the limit of `{MIN}`.'],
        max: [18, 'The value of `{PATH}` (`{VALUE}`) exceeds the limit of `{MAX}`.']
    },
    charisma: { 
        type: Number,
        default: 12,
        min: [4, 'The value of `{PATH}` (`{VALUE}`) is beneath the limit of `{MIN}`.'],
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