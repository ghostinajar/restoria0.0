import mongoose from 'mongoose';
import historySchema from './History.js';
import descriptionSchema from './Description.js';
import exitSchema from './Exit.js';
import mobNodeSchema from './MobNode.js';
import itemNodeSchema from './ItemNode.js';
import logger from '../../logger.js';
import worldEmitter from './WorldEmitter.js';

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
        itemBlueprint: {
            type: Schema.Types.ObjectId,
            ref: 'ItemBlueprint'
        },
        fromZone: {
            type: Schema.Types.ObjectId,
            ref: 'Zone'
        }
    }],
    mountIdForSale: [{
        mobBlueprint: {
            type: Schema.Types.ObjectId,
            ref: 'MobBlueprint'
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

//entityType should be a string to indicate which array to use ("mobs", "items", or "players")
roomSchema.methods.addEntityTo = function(entityType, instance) {
    //if the array exists, and the instance doesn't already exist in the array, add it
    if (this[entityType] && !this[entityType].find(el => el._id.toString() === instance._id.toString())) {
        this[entityType].push(instance);
    }
};

roomSchema.methods.removeEntityFrom = function(entityType, instance) {
    if (this[entityType]) {
      this[entityType] = this[entityType].filter(function(entity) {
        return entity !== instance;
      });
    }
};

roomSchema.methods.initiate = async function() {
    this.mobs = [];
    //add mobs based on mobNodes, signal mobManager
    this.items = []; 
    //load items array use itemNodes
    for (const itemNode of this.itemNodes) {
        try {
            //await promise alerting zoneManager to load or get the zone
            const zone = await new Promise((resolve) => {
                worldEmitter.once('zoneLoaded', resolve);
                worldEmitter.emit('zoneRequested', itemNode.fromZoneId);
            });
            if (!zone) {
                logger.error(`Room.initiate couldn't find Zone ${itemNode.fromZoneId}`);
            }

            //get the blueprint from the zone
            const blueprint = await zone.itemBlueprints.find(blueprint => blueprint._id.toString() === itemNode.loadsItemBlueprintId.toString());        
            if(!blueprint) {
                logger.error(`Room.initiate couldn't find blueprint ${itemNode.loadsItemBlueprintId} in zone ${zone.name}.`)
            }
            
            //repeat for itemNode.quantity
            for(let i = 0; i < itemNode.quantity; i++) {
                //await promise alerting itemManager to add new item 
                const item = await new Promise((resolve) => {
                    worldEmitter.once('itemManagerAddedItem', resolve);
                    worldEmitter.emit('newItemRequested', blueprint);
                  });
                //add item to this.items
                this.items.push(item);
            }
        } catch(err) {
            logger.error(`Encountered an error loading an item from itemNode. ${err.message}`);
            throw(err);
        }
    }
    logger.debug(this.items);
    this.players = [];
};

roomSchema.methods.clearContents = function() {
    this.mobs = [];
    this.items = [];
    this.players = [];
};

export default roomSchema;