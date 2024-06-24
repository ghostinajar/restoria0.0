// Room
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
    roomType: String,
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
    isOnFire: Boolean,
    blocksMounts: Boolean,
    blocksMobs: Boolean,
    blocksCasting: Boolean,
    blocksCombat: Boolean,
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
            validator: function (arr) {
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
            message: "Array should contain exactly 3 elements. The first and second elements should be between 0 and 79 (inclusive), and the third element should be between -10 and 10 (inclusive).",
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
    //if the array exists, and the instance doesn't already exist in the array, add it
    if (this[entityType] &&
        !this[entityType].find((el) => el._id.toString() === instance._id.toString())) {
        this[entityType].push(instance);
    }
};
roomSchema.methods.removeEntityFrom = function (entityType, instance) {
    if (this[entityType]) {
        this[entityType] = this[entityType].filter(function (entity) {
            return entity !== instance;
        });
    }
};
roomSchema.methods.initiate = async function () {
    //loadout mobs array
    this.mobs = [];
    if (this.mobNodes) {
        await activateMobNodes(this.mobNodes, this.mobs);
    }
    else {
        logger.log(`loadout`, `No mobnodes in ${this.name}.`);
    }
    logger.log(`loadout`, `Mobs in room "${this.name}": ${this.mobs.map((mob) => {
        return mob.name;
    })}`);
    //loadout inventory array
    this.inventory = [];
    await activateItemNodes(this.itemNodes, this.inventory);
    logger.log(`loadout`, `Inventory in room "${this.name}": ${JSON.stringify(this.inventory.map((item) => item.name))}`);
    //open users array
    this.users = [];
};
roomSchema.pre("save", function (next) {
    this.mobs = [];
    this.inventory = [];
    this.users = [];
    next();
});
roomSchema.methods.clearContents = async function () {
    await destroyMobs(this.mobs);
    this.mobs = [];
    this.inventory = [];
    this.users = [];
};
export default roomSchema;
