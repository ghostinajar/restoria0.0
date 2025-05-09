import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
const BASE_STRENGTH = 2;
const BASE_DEXTERITY = 2;
const BASE_CONSTITUTION = 2;
const BASE_INTELLIGENCE = 2;
const BASE_WISDOM = 2;
const BASE_CHARISMA = 2;
const BASE_HP = 10;
const BASE_MP = 10;
const BASE_MV = 10;
const BASE_SPEED = 0; // decreases movement cooldown
const BASE_HITBONUS = 2;
const BASE_DAMAGEBONUS = 0;
const BASE_ARMOR_CLASS = 10;
const BASE_HEALTH_REGEN = 2; // recovers a percentage of max per 6 seconds
const BASE_MANA_REGEN = 2;
const BASE_MOVE_REGEN = 2;
const BASE_RESIST_COLD = 0;
const BASE_RESIST_ELECTRIC = 0;
const BASE_RESIST_FIRE = 0;
const BASE_SPELL_SAVE = 0;
const BASE_CLERIC = {
    hpMod: 10,
    mpMod: 10,
    ssMod: 0.1,
};
const BASE_MAGE = {
    hpMod: 6,
    mpMod: 12,
    ssMod: 0.1,
};
const BASE_ROGUE = {
    hpMod: 10,
    mpMod: 8,
    dbMod: 0.25,
    hbMod: 0.13,
};
const BASE_WARRIOR = {
    hpMod: 12,
    mpMod: 6,
    dbMod: 0.13,
    hbMod: 0.25,
    acMod: 0.1,
};
export function calculateMaxHp(agent) {
    try {
        let maxHp = BASE_HP;
        maxHp += Math.max(0, (agent.statBlock.constitution - 10) / 2) * agent.level;
        if (agent.job === "cleric") {
            maxHp += agent.level * BASE_CLERIC.hpMod;
        }
        if (agent.job === "mage") {
            maxHp += agent.level * BASE_MAGE.hpMod;
        }
        if (agent.job === "rogue") {
            maxHp += agent.level * BASE_ROGUE.hpMod;
        }
        if (agent.job === "warrior") {
            maxHp += agent.level * BASE_WARRIOR.hpMod;
        }
        // TODO Add HP from equipped items
        return Math.max(BASE_HP, maxHp);
    }
    catch (error) {
        catchErrorHandlerForFunction(`calculateMaxHp`, error);
    }
}
export function calculateMaxMp(agent) {
    try {
        let maxMp = BASE_MP;
        if (agent.job === "cleric") {
            maxMp += agent.level * BASE_CLERIC.mpMod;
            maxMp += Math.max(0, agent.statBlock.wisdom - 10) * agent.level;
        }
        if (agent.job === "mage") {
            maxMp += agent.level * BASE_MAGE.mpMod;
            maxMp += Math.max(0, agent.statBlock.intelligence - 10) * agent.level;
        }
        if (agent.job === "rogue") {
            maxMp += agent.level * BASE_ROGUE.mpMod;
        }
        if (agent.job === "warrior") {
            maxMp += agent.level * BASE_WARRIOR.mpMod;
        }
        // TODO Add Mp from equipped items
        return Math.max(BASE_MP, maxMp);
    }
    catch (error) {
        catchErrorHandlerForFunction(`calculateMaxMp`, error);
    }
}
export function calculateMaxMv(agent) {
    try {
        let maxMv = BASE_MV;
        maxMv += agent.level * 10;
        maxMv += ((agent.statBlock.constitution - 10) / 2) * agent.level;
        // TODO Add Mv from equipped items
        return Math.max(BASE_MV, maxMv);
    }
    catch (error) {
        catchErrorHandlerForFunction(`calculateMaxMv`, error);
    }
}
export function calculateStrength(agent) {
    try {
        let strength = agent.statBlock.strength;
        // TODO Add strength from equipped items
        return Math.max(BASE_STRENGTH, strength);
    }
    catch (error) {
        catchErrorHandlerForFunction(`calculateStrength`, error);
    }
}
export function calculateDexterity(agent) {
    try {
        let dexterity = agent.statBlock.dexterity;
        // TODO Add dexterity from equipped items
        return Math.max(BASE_DEXTERITY, dexterity);
    }
    catch (error) {
        catchErrorHandlerForFunction(`calculateDexterity`, error);
    }
}
export function calculateConstitution(agent) {
    try {
        let constitution = agent.statBlock.constitution;
        // TODO Add constitution from equipped items
        return Math.max(BASE_CONSTITUTION, constitution);
    }
    catch (error) {
        catchErrorHandlerForFunction(`calculateConstitution`, error);
    }
}
export function calculateIntelligence(agent) {
    try {
        let intelligence = agent.statBlock.intelligence;
        // TODO Add intelligence from equipped items
        return Math.max(BASE_INTELLIGENCE, intelligence);
    }
    catch (error) {
        catchErrorHandlerForFunction(`calculateIntelligence`, error);
    }
}
export function calculateWisdom(agent) {
    try {
        let wisdom = agent.statBlock.wisdom;
        // TODO Add wisdom from equipped items
        return Math.max(BASE_WISDOM, wisdom);
    }
    catch (error) {
        catchErrorHandlerForFunction(`calculateWisdom`, error);
    }
}
export function calculateCharisma(agent) {
    try {
        let charisma = agent.statBlock.charisma;
        // TODO Add charisma from equipped items
        return Math.max(BASE_CHARISMA, charisma);
    }
    catch (error) {
        catchErrorHandlerForFunction(`calculateCharisma`, error);
    }
}
export function calculateDamageBonus(agent) {
    try {
        let damageBonus = BASE_DAMAGEBONUS;
        damageBonus += Math.floor((agent.statBlock.strength - 10) / 2);
        // TODO Add damage bonus from equipped items
        if (agent.job === "rogue") {
            damageBonus += Math.floor(agent.level * BASE_ROGUE.dbMod);
        }
        if (agent.job === "warrior") {
            damageBonus += Math.floor(agent.level * BASE_WARRIOR.dbMod);
        }
        return Math.max(BASE_DAMAGEBONUS, damageBonus);
    }
    catch (error) {
        catchErrorHandlerForFunction(`calculateDamageBonus`, error);
    }
}
export function calculateHitBonus(agent) {
    try {
        let hitBonus = BASE_HITBONUS;
        hitBonus += Math.floor((agent.statBlock.dexterity - 10) / 2);
        // TODO Add hit bonus from equipped items
        if (agent.job === "rogue") {
            hitBonus += Math.floor(agent.level * BASE_ROGUE.hbMod);
        }
        if (agent.job === "warrior") {
            hitBonus += Math.floor(agent.level * BASE_WARRIOR.hbMod);
        }
        return Math.max(BASE_HITBONUS, hitBonus);
    }
    catch (error) {
        catchErrorHandlerForFunction(`calculateHitBonus`, error);
    }
}
export function calculateArmorClass(agent) {
    try {
        let armorClass = BASE_ARMOR_CLASS;
        armorClass += Math.floor((agent.statBlock.dexterity - 10) / 2);
        // TODO Add armor class from equipped items
        if (agent.job === "warrior") {
            armorClass += Math.floor(agent.level * BASE_WARRIOR.acMod);
        }
        return Math.max(BASE_ARMOR_CLASS, armorClass);
    }
    catch (error) {
        catchErrorHandlerForFunction(`calculateArmorClass`, error);
    }
}
export function calculateSpellSave(agent) {
    try {
        let spellSave = BASE_SPELL_SAVE;
        spellSave += Math.floor((agent.statBlock.wisdom - 10) / 2);
        // TODO Add spell save from equipped items
        if (agent.job === "cleric") {
            spellSave += Math.floor(agent.level * BASE_CLERIC.ssMod);
        }
        if (agent.job === "mage") {
            spellSave += Math.floor(agent.level * BASE_MAGE.ssMod);
        }
        return Math.max(BASE_SPELL_SAVE, spellSave);
    }
    catch (error) {
        catchErrorHandlerForFunction(`calculateSpellSave`, error);
    }
}
export function calculateSpeed(agent) {
    try {
        let speed = BASE_SPEED;
        speed += Math.floor((agent.statBlock.dexterity - 10) / 2);
        // TODO Add speed from equipped items
        return Math.max(BASE_SPEED, speed);
    }
    catch (error) {
        catchErrorHandlerForFunction(`calculateSpeed`, error);
    }
}
export function calculateResistCold(agent) {
    try {
        let resistCold = BASE_RESIST_COLD;
        // TODO Add resist cold from equipped items
        return Math.max(BASE_RESIST_COLD, resistCold);
    }
    catch (error) {
        catchErrorHandlerForFunction(`calculateResistCold`, error);
    }
}
export function calculateResistFire(agent) {
    try {
        let resistFire = BASE_RESIST_FIRE;
        // TODO Add resist fire from equipped items
        return Math.max(BASE_RESIST_FIRE, resistFire);
    }
    catch (error) {
        catchErrorHandlerForFunction(`calculateResistFire`, error);
    }
}
export function calculateResistElec(agent) {
    try {
        let resistElec = BASE_RESIST_ELECTRIC;
        // TODO Add resist electric from equipped items
        return Math.max(BASE_RESIST_ELECTRIC, resistElec);
    }
    catch (error) {
        catchErrorHandlerForFunction(`calculateResistElec`, error);
    }
}
export function calculateHealthRegen(agent) {
    try {
        let healthRegen = BASE_HEALTH_REGEN;
        healthRegen += Math.floor((agent.statBlock.constitution - 10) / 2);
        // TODO Add health regen from equipped items
        return Math.max(BASE_HEALTH_REGEN, healthRegen);
    }
    catch (error) {
        catchErrorHandlerForFunction(`calculateHealthRegen`, error);
    }
}
export function calculateManaRegen(agent) {
    try {
        let manaRegen = BASE_MANA_REGEN;
        manaRegen += Math.floor((agent.statBlock.wisdom + agent.statBlock.intelligence - 20) / 4);
        // TODO Add mana regen from equipped items
        return Math.max(BASE_MANA_REGEN, manaRegen);
    }
    catch (error) {
        catchErrorHandlerForFunction(`calculateManaRegen`, error);
    }
}
export function calculateMoveRegen(agent) {
    try {
        let moveRegen = BASE_MOVE_REGEN;
        moveRegen += Math.floor((agent.statBlock.constitution - 10) / 2);
        // TODO Add move regen from equipped items
        return Math.max(BASE_MOVE_REGEN, moveRegen);
    }
    catch (error) {
        catchErrorHandlerForFunction(`calculateMoveRegen`, error);
    }
}
