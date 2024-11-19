// Room
// Class and schema for room blueprint
// Also allows active room instance to manage its contents (items/mobs/users)
import mongoose from "mongoose";
import historySchema, { IHistory } from "./History.js";
import descriptionSchema, { IDescription } from "./Description.js";
import exitSchema, { IExit } from "./Exit.js";
import mobNodeSchema, { IMobNode } from "./MobNode.js";
import itemNodeSchema, { IItemNode } from "./ItemNode.js";
import logger from "../../logger.js";
import activateItemNodes from "../../util/activateItemNodes.js";
import activateMobNodes from "../../util/activateMobNodes.js";
import destroyMobs from "../../util/destroyMobs.js";
import { IMob } from "./Mob.js";
import { IItem } from "./Item.js";
import { IUser } from "./User.js";
import ROOM_TYPE from "../../constants/ROOM_TYPE.js";
import catchErrorHandlerForFunction from "../../util/catchErrorHandlerForFunction.js";

const { Schema } = mongoose;

export interface IForSale {
  blueprint: mongoose.Types.ObjectId;
  fromZone: mongoose.Types.ObjectId;
}

export interface IRoom {
  _id: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  fromZoneId: mongoose.Types.ObjectId;
  roomType: string;
  name: string;
  history: IHistory;
  playerCap: number;
  mobCap: number;
  isDark: boolean;
  isIndoors: boolean;
  isOnWater: boolean;
  isUnderwater: boolean;
  noMounts: boolean;
  noMobs: boolean;
  noMagic: boolean;
  noCombat: boolean;
  itemsForSale: Array<IForSale>;
  mountIdForSale: Array<IForSale>;
  mapCoords: Array<number>;
  description: IDescription;
  exits: {
    north?: IExit | null;
    south?: IExit | null;
    east?: IExit | null;
    west?: IExit | null;
    up?: IExit | null;
    down?: IExit | null;
  };
  mobNodes: Array<IMobNode>;
  itemNodes: Array<IItemNode>;
  inventory: Array<IItem>;
  mobs: Array<IMob>;
  users: Array<IUser>;

  addEntityTo(entityType: string, instance: IMob | IItem | IUser): void;
  removeEntityFrom(entityType: string, instance: IMob | IItem | IUser): void;
}

const roomSchema = new Schema<IRoom>({
  _id: Schema.Types.ObjectId,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  fromZoneId: {
    type: Schema.Types.ObjectId,
    ref: "Zone",
  },
  roomType: {
    type: String,
    default: ROOM_TYPE.NONE,
  },
  name: String,
  history: {
    type: historySchema,
    default: () => ({}),
  },
  playerCap: Number,
  mobCap: Number,
  isDark: Boolean,
  isIndoors: Boolean,
  isOnWater: Boolean,
  isUnderwater: Boolean,
  noMounts: Boolean,
  noMobs: Boolean,
  noMagic: Boolean,
  noCombat: Boolean,
  itemsForSale: [
    {
      itemBlueprint: {
        type: Schema.Types.ObjectId,
        ref: "ItemBlueprint",
      },
      fromZone: {
        type: Schema.Types.ObjectId,
        ref: "Zone",
      },
    },
  ],
  mountIdForSale: [
    {
      mobBlueprint: {
        type: Schema.Types.ObjectId,
        ref: "MobBlueprint",
      },
      fromZone: {
        type: Schema.Types.ObjectId,
        ref: "Zone",
      },
    },
  ],
  mapCoords: {
    type: [Number],
    validate: {
      validator: function (arr: Array<number>) {
        if (arr.length !== 3) {
          return false;
        }
        if (arr[0] < 0 || arr[0] >= 80 || arr[1] < 0 || arr[1] >= 80) {
          return false;
        }
        if (arr[2] < -10 || arr[2] > 10) {
          return false;
        }
        return true;
      },
      message:
        "Array should contain exactly 3 elements. The first and second elements should be between 0 and 79 (inclusive), and the third element should be between -10 and 10 (inclusive).",
    },
  },
  description: {
    type: descriptionSchema,
    default: () => ({}),
  },
  exits: {
    north: {
      type: exitSchema,
      default: null,
    },
    south: {
      type: exitSchema,
      default: null,
    },
    east: {
      type: exitSchema,
      default: null,
    },
    west: {
      type: exitSchema,
      default: null,
    },
    up: {
      type: exitSchema,
      default: null,
    },
    down: {
      type: exitSchema,
      default: null,
    },
  },
  mobNodes: [
    {
      type: mobNodeSchema,
      default: () => ({}),
    },
  ],
  itemNodes: [
    {
      type: itemNodeSchema,
      default: () => ({}),
    },
  ],
  inventory: [],
  mobs: [],
  users: [],
});

//since there will only ever be one instance of a Room, the Room class will have
//arrays to store active mobs, inventory, and users inside the room.
//These are never saved in db.

//entityType should be a string to indicate which array to use ("mobs", "inventory", or "users")
roomSchema.methods.addEntityTo = function (
  entityType: string,
  instance: IMob | IItem | IUser
) {
  try {
    if (
      this[entityType] &&
      !this[entityType].find(
        (el: IMob | IItem | IUser) =>
          el._id.toString() === instance._id.toString()
      )
    ) {
      this[entityType].push(instance);
    } else {
      logger.warn(
        `Entity ${instance._id} already exists in ${entityType} for room ${this._id}`
      );
    }
  } catch (error: unknown) {
    catchErrorHandlerForFunction(
      `Room.addEntityTo for room id ${this._id}, entityType: ${entityType}`,
      error
    );
  }
};

roomSchema.methods.removeEntityFrom = function (
  entityType: string,
  instance: IMob | IItem | IUser
) {
  try {
    if (this[entityType]) {
      this[entityType] = this[entityType].filter(function (
        entity: IMob | IItem | IUser
      ) {
        return entity !== instance;
      });
    }
  } catch (error: unknown) {
    catchErrorHandlerForFunction(
      `Room.removeEntityFrom for room id ${this._id}`,
      error
    );
  }
};

roomSchema.methods.initiate = async function () {
  try {
    //loadout mobs array
    this.mobs = [];
    if (this.mobNodes) {
      await activateMobNodes(this.mobNodes, this.mobs);
    }

    //loadout inventory array
    this.inventory = [];
    await activateItemNodes(this.itemNodes, this.inventory);

    //open users array
    this.users = [];
  } catch (error: unknown) {
    catchErrorHandlerForFunction(
      `Room.initiate for room id ${this._id}`,
      error
    );
  }
};

roomSchema.pre("save", function (next) {
  this.mobs = [];
  this.inventory = [];
  this.users = [];
  next();
});

roomSchema.methods.clearContents = async function () {
  try {
    await destroyMobs(this.mobs);
    this.mobs = [];
    this.inventory = [];
    this.users = [];
  } catch (error: unknown) {
    catchErrorHandlerForFunction(
      `Room.clearContents for room id ${this._id}`,
      error
    );
  }
};

export default roomSchema;
