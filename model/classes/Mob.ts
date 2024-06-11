import { IAffix } from "./Affix";
import { IChatter } from "./Chatter";
import { IDescription } from "./Description";
import { IEmote } from "./Emote";
import { IItem } from "./Item";
import { IMobBlueprint } from "./MobBlueprint";
import { IStatBlock } from "./StatBlock";
import mongoose from "mongoose";

export interface IMob {
    author: mongoose.Schema.Types.ObjectId;
    name: string;
    pronouns: number;
    level: number;
    job: string;
    statBlock: IStatBlock
    goldHeld: number;
    isUnique: boolean;
    isMount: boolean;
    isAggressive: boolean;
    chattersToPlayer: boolean;
    emotesToPlayer: boolean;
    description: IDescription
    keywords: Array<string>;
    affixes: Array<IAffix>;
    chatters: Array<IChatter>;
    emotes: Array<IEmote>;
    inventory: Array<IItem>;
}

class Mob implements IMob {
    constructor (blueprint : IMobBlueprint) {
        this.author = blueprint.author;
        this.name = blueprint.name;
        this.pronouns = blueprint.pronouns;
        this.level = blueprint.level;
        this.job = blueprint.job;
        this.statBlock = blueprint.statBlock;
        this.goldHeld = blueprint.goldHeld;
        this.isUnique = blueprint.isUnique;
        this.isMount = blueprint.isMount;
        this.isAggressive = blueprint.isAggressive;
        this.chattersToPlayer = blueprint.chattersToPlayer;
        this.emotesToPlayer = blueprint.emotesToPlayer;
        this.description = blueprint.description;
        this.keywords = blueprint.keywords;
        this.affixes = blueprint.affixes;
        this.chatters = blueprint.chatters;
        this.emotes = blueprint.emotes;
        this.inventory = [];
    };
    author: mongoose.Schema.Types.ObjectId;
    name: string;
    pronouns: number;
    level: number;
    job: string;
    statBlock: IStatBlock
    goldHeld: number;
    isUnique: boolean;
    isMount: boolean;
    isAggressive: boolean;
    chattersToPlayer: boolean;
    emotesToPlayer: boolean;
    description: IDescription
    keywords: Array<string>;
    affixes: Array<IAffix>;
    chatters: Array<IChatter>;
    emotes: Array<IEmote>;
    inventory: Array<IItem>;
};

export default Mob;