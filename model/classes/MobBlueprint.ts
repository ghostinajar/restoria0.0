import mongoose from 'mongoose';
import historySchema, { IHistory } from './History.js';
import statBlockSchema, { IStatBlock } from './StatBlock.js';
import descriptionSchema, { IDescription } from './Description.js';
import affixSchema, { IAffix } from './Affix.js';
import chatterSchema, { IChatter } from './Chatter.js';
import emoteSchema, { IEmote } from './Emote.js';
import itemNodeSchema, { IItemNode } from './ItemNode.js';

const { Schema } = mongoose;
/*only mobs and items have blueprints, and only because multiple instances 
of them will exist in game simultaneously, and they can't all share the same id
*/

export interface IMobBlueprint {
    _id: mongoose.Types.ObjectId;
    author: mongoose.Types.ObjectId;
    name: string;
    pronouns: number;
    history: IHistory;
    level: number;
    job: string;
    statBlock: IStatBlock;
    goldHeld: number;
    isUnique: boolean;
    isMount: boolean;
    isAggressive: boolean;
    chattersToPlayer: boolean;
    emotesToPlayer: boolean;
    description: IDescription;
    keywords: Array<string>;
    affixes: Array<IAffix>;
    chatters: Array<IChatter>;
    emotes: Array<IEmote>;
    itemNodes: Array<IItemNode>;
    capacity: number;
}

const mobBlueprintSchema = new Schema<IMobBlueprint>({
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