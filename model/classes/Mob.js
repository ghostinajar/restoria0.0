import mongoose from "mongoose";
class Mob {
    constructor(blueprint) {
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
    _id;
    author;
    name;
    pronouns;
    level;
    job;
    statBlock;
    goldHeld;
    isUnique;
    isMount;
    isAggressive;
    chattersToPlayer;
    emotesToPlayer;
    description;
    keywords;
    affixes;
    equipped;
    chatters;
    emotes;
    inventory;
}
export default Mob;
