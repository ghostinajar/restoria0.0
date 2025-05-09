export interface IAffixBonuses {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  speed: number;
  hitBonus: number;
  damageBonus: number;
  armorClass: number;
  health: number;
  healthRegen: number;
  mana: number;
  manaRegen: number;
  movement: number;
  moveRegen: number;
  resistCold: number;
  resistElectric: number;
  resistFire: number;
  spellSave: number;
}

export const AFFIX_BONUSES: IAffixBonuses = {
  strength: 0,
  dexterity: 0,
  constitution: 0,
  intelligence: 0,
  wisdom: 0,
  charisma: 0,
  speed: 0,
  hitBonus: 0,
  damageBonus: 0,
  armorClass: 0,
  health: 0,
  healthRegen: 0,
  mana: 0,
  manaRegen: 0,
  movement: 0,
  moveRegen: 0,
  resistCold: 0,
  resistElectric: 0,
  resistFire: 0,
  spellSave: 0,
};
