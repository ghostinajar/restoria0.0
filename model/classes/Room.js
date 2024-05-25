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
        type: [Number],
        validate: {
          validator: function(arr) {
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
          message: 'Array should contain exactly 3 elements. The first and second elements should be between 0 and 79 (inclusive), and the third element should be between -10 and 10 (inclusive).'
        }
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