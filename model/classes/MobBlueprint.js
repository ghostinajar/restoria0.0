import mongoose from 'mongoose';
import historySchema from './History.js';
import statBlockSchema from './StatBlock.js';
import descriptionSchema from './Description.js';
import affixSchema from './Affix.js';
import chatterSchema from './Chatter.js';
import emoteSchema from './Emote.js';
import itemNodeSchema from './ItemNode.js';
const { Schema } = mongoose;
const mobBlueprintSchema = new Schema({
    _id: Schema.Types.ObjectId,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    name: String,
    pronouns: Number, // 0 = he/him, 1 = it/it, 2 = she/her, 3 = they/them
    history: {
        type: historySchema,
        default: () => ({})
    },
    level: Number,
    job: String,
    statBlock: {
        type: statBlockSchema,
        default: () => ({})
    },
    goldHeld: Number,
    isUnique: Boolean,
    isMount: Boolean,
    isAggressive: Boolean,
    chattersToPlayer: Boolean,
    emotesToPlayer: Boolean,
    description: {
        type: descriptionSchema,
        default: () => ({})
    },
    keywords: [String],
    affixes: [{
            type: affixSchema,
            default: () => ({})
        }],
    chatters: [{
            type: chatterSchema,
            default: () => ({})
        }],
    emotes: [{
            type: emoteSchema,
            default: () => ({})
        }],
    itemNodes: [{
            type: itemNodeSchema,
            default: () => ({})
        }],
    capacity: {
        type: Number,
        default: 10
    }
});
export default mobBlueprintSchema;
