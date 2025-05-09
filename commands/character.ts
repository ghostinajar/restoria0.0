// character
// shows user their full character stats

import { IUser } from "../model/classes/User.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import { IParsedCommand } from "../util/parseCommand.js";

async function character(parsedCommand: IParsedCommand, user: IUser) {
  try {
    let characterData = {
      name: user.name,
      lvl: user.level,
      job: user.job,

      strength: user.strength,
      dexterity: user.dexterity,
      constitution: user.constitution,
      intelligence: user.intelligence,
      wisdom: user.wisdom,
      charisma: user.charisma,

      damageBonus: user.damageBonus,
      hitBonus: user.hitBonus,
      armorClass: user.armorClass,
      spellSave: user.spellSave,
      spirit: user.statBlock.spirit,
      speed: user.speed,

      clericLvl: user.jobLevels.cleric,
      mageLvl: user.jobLevels.mage,
      rogueLvl: user.jobLevels.rogue,
      warriorLvl: user.jobLevels.warrior,
      trainingPoints: user.trainingPoints,
      inventoryCount: user.inventory.length,
      capacity: user.capacity,

      resistCold: user.resistCold,
      resistFire: user.resistFire,
      resistElec: user.resistElec,
      creationYear: new Date(user.history.creationDate).getFullYear(),
      hoursPlayed: user.hoursPlayed,

      goldHeld: user.goldHeld,
      goldBanked: user.goldBanked,
    };

    worldEmitter.emit(`characterDataFor${user.username}`, characterData);
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`character`, error, user?.name);
  }
}

export default character;
