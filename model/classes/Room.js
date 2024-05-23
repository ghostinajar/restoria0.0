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
    roomType: String,
    name: String,
    history: historySchema,
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
    description: descriptionSchema,
    exits: {
        north: exitSchema,
        south: exitSchema,
        east: exitSchema,
        west: exitSchema,
        up: exitSchema,
        down: exitSchema,
    },
    mobNodes: [mobNodeSchema],            
    itemNodes: [itemNodeSchema],
    //populate from below
});     

roomSchema.methods.initiate = function() {
    this.mobs = [];
    this.items = [];
    this.users = [];
    this.characters = [];
};

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