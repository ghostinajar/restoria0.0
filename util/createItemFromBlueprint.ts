import logger from '../logger.js';
import mongoose from 'mongoose';
import { IItemBlueprint } from '../model/classes/ItemBlueprint.js';

async function createItemFromBlueprint (blueprint : IItemBlueprint) {
    // Create a copy of the blueprint and give its own unique Id
    const item = JSON.parse(JSON.stringify(blueprint));
    item._id = new mongoose.Types.ObjectId();
    item.history = {
        creationDate: Date.now,
    }
    item.itemNodes = null
    logger.log(`loadout`, `createItemFromBlueprint: ${item.name}`);
    return item;
}

export default createItemFromBlueprint;