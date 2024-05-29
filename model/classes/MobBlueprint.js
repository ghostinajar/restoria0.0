import mongoose from 'mongoose';
import historySchema from './History.js';
import statBlockSchema from './StatBlock.js';
import descriptionSchema from './Description.js';
import affixSchema from './Affix.js';
import chatterSchema from './Chatter.js';
import emoteSchema from './Emote.js';
import itemNodeSchema from './ItemNode.js';

const { Schema } = mongoose;
/*only mobs and items have blueprints, and only because multiple instances 
of them will exist in game simultaneously, and they can't all share the same id
There is no Mob.js schema since mobs are never saved, only their blueprints
*/

const mobBlueprintSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    name: String,
    pronouns: Number, // 0 = it/it, 1 = he/him, 2 = she/her, 3 = they/them
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
});

export default mobBlueprintSchema;