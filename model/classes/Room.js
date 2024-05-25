import mongoose from 'mongoose';
import historySchema from './History.js';
import descriptionSchema from './Description.js';
import exitSchema from './Exit.js';
import mobNodeSchema from './MobNode.js';
import itemNodeSchema from './ItemNode.js';

const { Schema } = mongoose;

const roomSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    fromZoneId: {
        type: Schema.Types.ObjectId,
        ref: 'Zone'
    },
    roomType: String,
    name: String,
    history: {
        type: historySchema,
        default: () => ({})
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
    itemsForSale: [{
        item: {
            type: Schema.Types.ObjectId,
            ref: 'Item'
        },
        fromZone: {
            type: Schema.Types.ObjectId,
            ref: 'Zone'
        }
    }],
    mountIdForSale: [{
        mob: {
            type: Schema.Types.ObjectId,
            ref: 'mob'
        },
        fromZone: {
            type: Schema.Types.ObjectId,
            ref: 'Zone'
        }
    }],
    mapCoords: {
        x: Number,
        y: Number,
        z: Number,
    },
    description: {
        type: descriptionSchema,
        default: () => ({})
    },
    exits: {
        north: {
            type: exitSchema,
            default: () => ({})
        },
        south: {
            type: exitSchema,
            default: () => ({})
        },
        east: {
            type: exitSchema,
            default: () => ({})
        },
        west: {
            type: exitSchema,
            default: () => ({})
        },
        up: {
            type: exitSchema,
            default: () => ({})
        },
        down: {
            type: exitSchema,
            default: () => ({})
        },
    },
    mobNodes: [{
        type: mobNodeSchema,
        default: () => ({})
    }],            
    itemNodes: [{
        type: itemNodeSchema,
        default: () => ({})
    }],
});     

//since there will only ever be one instance of a Room, the Room class will have
//arrays to store active mobs, items, users, and characters inside the room
//during gameplay. These are added via methods since they never need to be in db

roomSchema.methods.initiate = function() {
    this.mobs = [];
    this.items = [];
    this.users = [];
    this.characters = [];
};

//entityType should be a string to indicate which array to use ("mobs", "items", "users", or "characters")
roomSchema.methods.addEntity = function(entityType, instance) {
    if (this[entityType]) {
      this[entityType].push(instance);
    }
};

roomSchema.methods.removeEntity = function(entityType, instance) {
    if (this[entityType]) {
      this[entityType] = this[entityType].filter(function(entity) {
        return entity !== instance;
      });
    }
};

export default roomSchema;