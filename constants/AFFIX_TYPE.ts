const AFFIX_TYPE = {
    NONE: 'none',
    STRENGTH: 'strength',
    DEXTERITY: 'dexterity',
    CONSTITUTION: 'constitution',
    INTELLIGENCE: 'intelligence',
    WISDOM: 'wisdom',
    CHARISMA: 'charisma',
    STAMINA: 'stamina',
    HITBONUS: 'hit_bonus',
    DAMAGEBONUS: 'damage_bonus',
    ARMOR: 'armor',
    HEALTH: 'health',
    HEALTH_REGEN: 'health_regen',    
    MANA: 'mana',
    MANA_REGEN: 'mana_regen',
    MOVEMENT: 'movement',
    RESIST_COLD: 'resist_cold',
    RESIST_ELECTRIC: 'resist_electric',
    RESIST_FIRE: 'resist_fire',
    SPELL_SAVE: 'spell_save',
};

export const affixTypes = Object.values(AFFIX_TYPE);

export default AFFIX_TYPE;