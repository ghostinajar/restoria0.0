import { IAffix } from "./Affix";
import { IChatter } from "./Chatter";
import { IDescription } from "./Description";
import { IEmote } from "./Emote";
import itemSchema, { IItem } from "./Item.js";
import { IMobBlueprint } from "./MobBlueprint";
import { IStatBlock } from "./StatBlock";
import mongoose, { Types } from "mongoose";
import { IEquipped } from "./User";

export interface IMob {
  _id: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  name: string;
  pronouns: number;
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
  inventory: Array<IItem>;
  equipped: IEquipped;
}

class Mob implements IMob {
  constructor(blueprint: IMobBlueprint) {
    this._id = new mongoose.Types.ObjectId();
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
    (this.equipped = {
      arms: null,
      body: null,
      ears: null,
      feet: null,
      finger1: null,
      finger2: null,
      hands: null,
      head: null,
      held: null,
      legs: null,
      neck: null,
      shield: null,
      shoulders: null,
      waist: null,
      wrist1: null,
      wrist2: null,
      weapon1: null,
      weapon2: null,
    }),
      (this.chatters = blueprint.chatters);
    this.emotes = blueprint.emotes;
    this.inventory = [];
  }
  _id: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  name: string;
  pronouns: number;
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
  equipped: IEquipped;
  chatters: Array<IChatter>;
  emotes: Array<IEmote>;
  inventory: Array<IItem>;
}

export default Mob;
