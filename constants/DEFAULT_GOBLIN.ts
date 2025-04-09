import mongoose from "mongoose";
import COMPLETION_STATUS from "./COMPLETION_STATUS.js";

export const DEFAULT_GOBLIN = {
  _id: new mongoose.Types.ObjectId(),
  author: new mongoose.Types.ObjectId("665bc7ca1eeaedf3a5da7446"),
  name: "a goblin",
  pronouns: 1,
  history: {
    creationDate: new Date(),
    modifiedDate: new Date(),
    completionStatus: COMPLETION_STATUS.DRAFT,
  },
  level: 1,
  job: "rogue",
  statBlock: {
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
    spirit: 10,
  },
  goldHeld: 0,
  isUnique: false,
  isMount: false,
  isAggressive: false,
  chattersToPlayer: false,
  emotesToPlayer: false,
  description: {
    look: `There's a basic goblin here.`,
    examine: `He's green and mean. With this kind of goblin, when you've seen one you've seen them all.`,
  },
  keywords: [`goblin`],
  affixes: [],
  chatters: [],
  emotes: [],
  itemNodes: [],
  capacity: 10,
};
