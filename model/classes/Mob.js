class Mob {
    constructor (blueprint) {
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
};

export default Mob;