import mongoose from 'mongoose';
import historySchema from './History.js';
import statBlockSchema from './StatBlock.js';
import descriptionSchema from './Description.js';
import affixSchema from './Affix.js';
import chatterSchema from './Chatter.js';
import emoteSchema from './Emote.js';
import itemNodeSchema from './ItemNode.js';

const { Schema } = mongoose;

//since mob instances will never be saved, 
//mobManager will have to assign them unique Ids

const mobSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    name: String,
    pronouns: Number, // 0 = it/it, 1 = he/him, 2 = she/her, 3 = they/them
    history: historySchema,
    level: Number,
    job: String,
    statBlock: statBlockSchema,
    goldHeld: Number,
    isUnique: Boolean,
    isMount: Boolean,
    isAggressive: Boolean,
    chattersToPlayer: Boolean,
    emotesToPlayer: Boolean,
    description: descriptionSchema,
    keywords: [String],
    affixes: [affixSchema],
    chatters: [chatterSchema], 
    emotes: [emoteSchema],
    itemNodes: [itemNodeSchema],
});

export default mobSchema;