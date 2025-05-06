// base stats and calculations for mobs and users
import { IMob } from "../model/classes/Mob.js";
import { IUser } from "../model/classes/User.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";

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
};

const BASE_MAGE = {
  hpMod: 6,
  mpMod: 12,
};

const BASE_ROGUE = {
  hpMod: 10,
  mpMod: 8,
};

const BASE_WARRIOR = {
  hpMod: 12,
  mpMod: 6,
};

export function calculateMaxHp(agent: IUser | IMob) {
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
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`calculateMaxHp`, error);
  }
}

export function calculateMaxMp(agent: IUser | IMob) {
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
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`calculateMaxMp`, error);
  }
}

export function calculateMaxMv(agent: IUser | IMob) {
  try {
    let MaxMv = BASE_MV;
    MaxMv += agent.level * 10; // Increase by level
    MaxMv += ((agent.statBlock.constitution - 10) / 2) * agent.level; // Add constitution bonus * level
    // TODO Add Mv from equipped items
    return MaxMv;
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`calculateMaxMv`, error);
  }
}

export function calculateStrength(agent: IUser | IMob) {
  try {
    let strength = agent.statBlock.strength;
    // TODO Add strength from equipped items
    return strength;
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`calculateStrength`, error);
  }
}

export function calculateDexterity(agent: IUser | IMob) {
  try {
    let dexterity = agent.statBlock.dexterity;
    // TODO Add dexterity from equipped items
    return dexterity;
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`calculateDexterity`, error);
  }
}

export function calculateConstitution(agent: IUser | IMob) {
  try {
    let constitution = agent.statBlock.constitution;
    // TODO Add constitution from equipped items
    return constitution;
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`calculateConstitution`, error);
  }
}

export function calculateIntelligence(agent: IUser | IMob) {
  try {
    let intelligence = agent.statBlock.intelligence;
    // TODO Add intelligence from equipped items
    return intelligence;
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`calculateIntelligence`, error);
  }
}

export function calculateWisdom(agent: IUser | IMob) {
  try {
    let wisdom = agent.statBlock.wisdom;
    // TODO Add wisdom from equipped items
    return wisdom;
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`calculateWisdom`, error);
  }
}

export function calculateCharisma(agent: IUser | IMob) {
  try {
    let charisma = agent.statBlock.charisma;
    // TODO Add charisma from equipped items
    return charisma;
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`calculateCharisma`, error);
  }
}

export function calculateSpirit(agent: IUser | IMob) {
  try {
    let spirit = agent.statBlock.spirit;
    // TODO Add spirit from equipped items
    return spirit;
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`calculateSpirit`, error);
  }
}

export function calculateDamageBonus(agent: IUser | IMob) {
  try {
    let damageBonus = BASE_DAMAGEBONUS;
    damageBonus += Math.floor((agent.statBlock.strength - 10) / 2); // Add strength modifier
    // TODO Add damage bonus from equipped items
    return damageBonus;
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`calculateDamageBonus`, error);
  }
}

export function calculateHitBonus(agent: IUser | IMob) {
  try {
    let hitBonus = BASE_HITBONUS;
    hitBonus += Math.floor((agent.statBlock.dexterity - 10) / 2); // Add dexterity modifier
    // TODO Add hit bonus from equipped items
    return hitBonus;
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`calculateHitBonus`, error);
  }
}

export function calculateArmorClass(agent: IUser | IMob) {
  try {
    let armorClass = BASE_ARMOR_CLASS;
    armorClass += Math.floor((agent.statBlock.dexterity - 10) / 2); // Add dexterity modifier
    // TODO Add armor class from equipped items
    return armorClass;
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`calculateArmorClass`, error);
  }
}

export function calculateSpellSave(agent: IUser | IMob) {
  try {
    let spellSave = BASE_SPELL_SAVE;
    spellSave += Math.floor((agent.statBlock.wisdom - 10) / 2); // Add wisdom modifier
    // TODO Add spell save from equipped items
    return spellSave;
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`calculateSpellSave`, error);
  }
}

export function calculateSpeed(agent: IUser | IMob) {
  try {
    let speed = BASE_SPEED;
    speed += Math.floor((agent.statBlock.dexterity - 10) / 2); // Add dexterity modifier
    // TODO Add speed from equipped items
    return speed;
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`calculateSpeed`, error);
  }
}

export function calculateResistCold(agent: IUser | IMob) {
  try {
    let resistCold = BASE_RESIST_COLD;
    // TODO Add resist cold from equipped items
    return resistCold;
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`calculateResistCold`, error);
  }
}

export function calculateResistFire(agent: IUser | IMob) {
  try {
    let resistFire = BASE_RESIST_FIRE;
    // TODO Add resist fire from equipped items
    return resistFire;
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`calculateResistFire`, error);
  }
}

export function calculateResistElec(agent: IUser | IMob) {
  try {
    let resistElec = BASE_RESIST_ELECTRIC;
    // TODO Add resist electric from equipped items
    return resistElec;
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`calculateResistElec`, error);
  }
}

export function calculateHealthRegen(agent: IUser | IMob) {
  try {
    let healthRegen = BASE_HEALTH_REGEN;
    healthRegen += Math.floor((agent.statBlock.constitution - 10) / 2); // Add constitution modifier
    // TODO Add health regen from equipped items
    return healthRegen;
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`calculateHealthRegen`, error);
  }
}

export function calculateManaRegen(agent: IUser | IMob) {
  try {
    let manaRegen = BASE_MANA_REGEN;
    manaRegen += Math.floor(
      (agent.statBlock.wisdom + agent.statBlock.intelligence - 20) / 4
    ); // Add int & wis modifiers
    // TODO Add mana regen from equipped items
    return manaRegen;
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`calculateManaRegen`, error);
  }
}

export function calculateMoveRegen(agent: IUser | IMob) {
  try {
    let moveRegen = BASE_MOVE_REGEN;
    moveRegen += Math.floor((agent.statBlock.constitution - 10) / 2); // Add constitution modifier
    // TODO Add move regen from equipped items
    return moveRegen;
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`calculateMoveRegen`, error);
  }
}
