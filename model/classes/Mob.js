import mongoose from 'mongoose';
import historySchema from './History';
import statBlockSchema from './StatBlock';

const { Schema } = mongoose;

const mobSchema = new Schema({
    basedOnMobId: String, // how can we reference a Mob's ObjectId, which would be embedded in a zone?
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    name: String,
    pronouns: Number, // 0 = it/it, 1 = he/him, 2 = she/her, 3 = they/them
    history: historySchema,
    level: Number,
    job: String,
    statBlock:  statBlockSchema,
    goldHeld: Number,
    isUnique: Boolean,
    isMount: Boolean,
    isAggressive: Boolean,
    chattersToPlayer: Boolean,
    emotesToPlayer: Boolean,
    description: descriptionSchema,
    keywords: [String],
    affixes: [affixSchema],
    chatters: [ChatterSchema], 
    emotes: [EmoteSchema],
    itemNodes: [itemNodeSchema],
});


export default mobSchema;