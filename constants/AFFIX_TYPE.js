const AFFIX_TYPE = {
    NONE: "none",
    STRENGTH: "strength",
    DEXTERITY: "dexterity",
    CONSTITUTION: "constitution",
    INTELLIGENCE: "intelligence",
    WISDOM: "wisdom",
    CHARISMA: "charisma",
    SPEED: "speed", // decreases movement cooldown
    HITBONUS: "hitBonus",
    DAMAGEBONUS: "damageBonus",
    ARMOR_CLASS: "armorClass",
    HEALTH: "health",
    HEALTH_REGEN: "healthRegen",
    MANA: "mana",
    MANA_REGEN: "manaRegen",
    MOVEMENT: "movement",
    MOVE_REGEN: `moveRegen`,
    RESIST_COLD: "resistCold",
    RESIST_ELECTRIC: "resistElectric",
    RESIST_FIRE: "resistFire",
    SPELL_SAVE: "spellSave",
};
export const affixTypes = Object.values(AFFIX_TYPE);
export default AFFIX_TYPE;
