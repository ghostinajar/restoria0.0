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
    itemIdsForSale: [String], // how can we reference an Item's ObjectId, which would be embedded in a zone?
    mountIdForSale: [String], // how can we reference a Mob's ObjectId, which would be embedded in a zone?
    //mapCoord at "centre" of zone is 39,39,0 (so map can be loaded from 0,0 out to 79,79)
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

export default roomSchema;

 /* TODO add these unsaved properties to a room instance on instantiation

    mobInstances = [];  // map of references to instances (which are stored in MobManager)
    itemInstances = [];  // map of references to instances (which are stored in ItemManager)
    userInstances = [];  // // map of references to instances (which are stored in UserManager)
    characterInstances = [];  // map of references to instances (which are stored in CharacterManager)

    addMob(mob) {
        this.mobs.push(mob.id);
    }

    addItem(item) {
        this.items.push(item.id);
    }
*/