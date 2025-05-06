import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
const BASE_HP = 10;
const BASE_MP = 10;
const BASE_MV = 10;
const BASE_SPEED = 0;
const BASE_HITBONUS = 0;
const BASE_DAMAGEBONUS = 0;
const BASE_ARMOR = 0;
const BASE_HEALTH_REGEN = 0;
const BASE_MANA_REGEN = 0;
const BASE_MOVE_REGEN = 0;
const BASE_RESIST_COLD = 0;
const BASE_RESIST_ELECTRIC = 0;
const BASE_RESIST_FIRE = 0;
const BASE_SPELL_SAVE = 0;
const BASE_CLERIC = {
    hpMod: 10,
    mpMod: 10,
};
const BASE_MAGE = {
    hpMod: 8,
    mpMod: 12,
};
const BASE_ROGUE = {
    hpMod: 10,
    mpMod: 10,
};
const BASE_WARRIOR = {
    hpMod: 12,
    mpMod: 8,
};
// calculateMaxHp
export function calculateMaxHp(agent) {
    try {
        let maxHp = BASE_HP;
        maxHp += Math.max(0, (agent.statBlock.constitution - 10) / 2) * agent.level; // Add constitution bonus * level
        if (agent.job === "cleric") {
            maxHp += agent.level * BASE_CLERIC.hpMod; // Increase by level
        }
        if (agent.job === "mage") {
            maxHp += agent.level * BASE_MAGE.hpMod; // Increase by level
        }
        if (agent.job === "rogue") {
            maxHp += agent.level * BASE_ROGUE.hpMod; // Increase by level
        }
        if (agent.job === "warrior") {
            maxHp += agent.level * BASE_WARRIOR.hpMod; // Increase by level
        }
        // TODO Add HP from equipped items
        return maxHp;
    }
    catch (error) {
        catchErrorHandlerForFunction(`calculateMaxHp`, error);
    }
}
// calculateMaxHp
export function calculateMaxMp(agent) {
    try {
        let maxMp = BASE_MP;
        if (agent.job === "cleric") {
            maxMp += agent.level * BASE_CLERIC.mpMod; // Increase by level
            maxMp += Math.max(0, agent.statBlock.wisdom - 10) * agent.level; // Add wisdom bonus * level
        }
        if (agent.job === "mage") {
            maxMp += agent.level * BASE_MAGE.mpMod; // Increase by level
            maxMp += Math.max(0, agent.statBlock.intelligence - 10) * agent.level; // Add intelligence bonus * level
        }
        if (agent.job === "rogue") {
            maxMp += agent.level * BASE_ROGUE.mpMod; // Increase by level
        }
        if (agent.job === "warrior") {
            maxMp += agent.level * BASE_WARRIOR.mpMod; // Increase by level
        }
        // TODO Add Mp from equipped items
        return maxMp;
    }
    catch (error) {
        catchErrorHandlerForFunction(`calculateMaxMp`, error);
    }
}
// calculateMaxMv
export function calculateMaxMv(agent) {
    try {
        let MaxMv = BASE_MV;
        MaxMv += agent.level * 10; // Increase by level
        MaxMv += ((agent.statBlock.constitution - 10) / 2) * agent.level; // Add constitution bonus * level
        // TODO Add Mv from equipped items
        return MaxMv;
    }
    catch (error) {
        catchErrorHandlerForFunction(`calculateMaxMv`, error);
    }
}
