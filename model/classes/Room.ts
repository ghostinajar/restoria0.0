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
import recall from "../../commands/recall.js";

const { Schema } = mongoose;

export interface IForSale {
  blueprint: mongoose.Types.ObjectId;
  fromZone: mongoose.Types.ObjectId;
}

export interface IMapTile {
  character: string;
  color: string;
  wallColor: string;
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
  mapCoords: [number, number, number];
  mapTile: {
    character: string;
    color: string;
    wallColor: string;
  };
  description: IDescription;
  exits: {
    [key: string]: IExit | null | undefined;
    north?: IExit | null;
    south?: IExit | null;
    east?: IExit | null;
    west?: IExit | null;
    up?: IExit | null;
    down?: IExit | null;
  };
  mobNodes: Array<IMobNode>;
  itemNodes: Array<IItemNode>;
  _mobs?: Array<IMob>; // Volatile property
  _inventory?: Array<IItem>; // Volatile property
  _users?: Array<IUser>; // Volatile property
  mobs: Array<IMob>;
  inventory: Array<IItem>;
  users: Array<IUser>;

  addEntityTo(entityType: string, instance: IMob | IItem | IUser): void;
  removeEntityFrom(entityType: string, instance: IMob | IItem | IUser): void;
}

const roomSchema = new Schema<IRoom>(
  {
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
        validator: function (v: number[]) {
          return v.length === 3;
        },
        message: "Array must contain exactly 3 numbers.",
      },
    },
    mapTile: {
      character: {
        type: String,
        default: "·",
      },
      color: {
        type: String,
        default: "white",
      },
      wallColor: {
        type: String,
        default: "white",
      },
    },
    description: {
      type: descriptionSchema,
      default: () => ({
        look: "This room's author can use EDIT ROOM to add a LOOK description.",
        examine: "This room's author can use EDIT ROOM to add an EXAMINE description.",
        study: "",
        research: "",
      }),
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
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

// Add virtual properties for mobs, inventory, and users
roomSchema
  .virtual("mobs")
  .get(function () {
    if (!this._mobs) {
      this._mobs = [];
    }
    return this._mobs;
  })
  .set(function (v) {
    this._mobs = v;
  });

roomSchema
  .virtual("inventory")
  .get(function () {
    if (!this._inventory) {
      this._inventory = [];
    }
    return this._inventory;
  })
  .set(function (v) {
    this._inventory = v;
  });

roomSchema
  .virtual("users")
  .get(function () {
    if (!this._users) {
      this._users = [];
    }
    return this._users;
  })
  .set(function (v) {
    this._users = v;
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
    // Reset volatile properties
    this._mobs = [];
    this._inventory = [];

    // Load mobs from nodes
    if (this.mobNodes) {
      await activateMobNodes(this.mobNodes, this.mobs);
    }

    // Load items from nodes
    await activateItemNodes(this.itemNodes, this.inventory);

    // No need to initialize users here as the virtual property handles it
  } catch (error: unknown) {
    catchErrorHandlerForFunction(
      `Room.initiate for room id ${this._id}`,
      error
    );
  }
};

roomSchema.pre("save", function (next) {
  next();
});

roomSchema.methods.clearContents = async function () {
  try {
    await destroyMobs(this.mobs);
    this.mobs = [];

    // destroy items
    for (const item of this.inventory) {
      item.inventory = [];
    }
    this.inventory = [];

    // recall users
    for (const user of this.users) {
      recall(user);
    }
    this.users = [];
  } catch (error: unknown) {
    catchErrorHandlerForFunction(
      `Room.clearContents for room id ${this._id}`,
      error
    );
  }
};

export default roomSchema;
