// Room
// Class and schema for room blueprint
// Also allows active room instance to manage its contents (items/mobs/users)
import mongoose from "mongoose";
import historySchema from "./History.js";
import descriptionSchema from "./Description.js";
import exitSchema from "./Exit.js";
import mobNodeSchema from "./MobNode.js";
import itemNodeSchema from "./ItemNode.js";
import logger from "../../logger.js";
import activateItemNodes from "../../util/activateItemNodes.js";
import activateMobNodes from "../../util/activateMobNodes.js";
import destroyMobs from "../../util/destroyMobs.js";
import ROOM_TYPE from "../../constants/ROOM_TYPE.js";
import catchErrorHandlerForFunction from "../../util/catchErrorHandlerForFunction.js";
import recall from "../../commands/recall.js";
const { Schema } = mongoose;
const roomSchema = new Schema({
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
            validator: function (v) {
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
roomSchema.methods.addEntityTo = function (entityType, instance) {
    try {
        if (this[entityType] &&
            !this[entityType].find((el) => el._id.toString() === instance._id.toString())) {
            this[entityType].push(instance);
        }
        else {
            logger.warn(`Entity ${instance._id} already exists in ${entityType} for room ${this._id}`);
        }
    }
    catch (error) {
        catchErrorHandlerForFunction(`Room.addEntityTo for room id ${this._id}, entityType: ${entityType}`, error);
    }
};
roomSchema.methods.removeEntityFrom = function (entityType, instance) {
    try {
        if (this[entityType]) {
            this[entityType] = this[entityType].filter(function (entity) {
                return entity !== instance;
            });
        }
    }
    catch (error) {
        catchErrorHandlerForFunction(`Room.removeEntityFrom for room id ${this._id}`, error);
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
    }
    catch (error) {
        catchErrorHandlerForFunction(`Room.initiate for room id ${this._id}`, error);
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
    }
    catch (error) {
        catchErrorHandlerForFunction(`Room.clearContents for room id ${this._id}`, error);
    }
};
export default roomSchema;
