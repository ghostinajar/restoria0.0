import logger from '../../logger.js';
import Item from './Item.js';
import worldEmitter from './WorldEmitter.js';
import mongoose from 'mongoose';

class ItemManager {
    constructor() {
        this.items = new Map();  // Stores all items with their _id.toString() as key
        
        const loadingItemHandler = async (id) => {
            //logger.info(`worldEmitter received 'loadingItem' and ${id}, checking...`)
            const item = await this.addItemById(id);
            //logger.info(`worldEmitter sending 'itemManagerAddedItem' and ${item.name}...`)
            worldEmitter.emit('itemManagerAddedItem', item);
        };

        const inventoryRequestingNewItemHandler = async (blueprint) => {
            // Create a copy of the blueprint and give its own unique Id
            const item = new Item(blueprint);
            item._id = new mongoose.Types.ObjectId();
            this.items.set(item._id.toString(), item);
            //logger.debug(`itemManager added ${item.name} to items. Items after adding: ${JSON.stringify(Array.from(this.items.values()).map(item => item.name))}`);
            worldEmitter.emit('itemManagerAddedItem', item);
        }

        const removingItemHandler = async (itemId) => {
            //logger.debug(`removingItemHandler called...`)
            //logger.debug(`removingItemHandler removing item with id: ${itemId}`)
            await this.removeItemById(itemId);
            worldEmitter.emit('itemManagerRemovedItem')
        };

        worldEmitter.on('inventoryDestroyingItem', removingItemHandler);
        worldEmitter.on('inventoryRequestingNewItem', inventoryRequestingNewItemHandler);
        worldEmitter.on('characterLoadingItem', loadingItemHandler);
        worldEmitter.on('characterRemovingItem', removingItemHandler);
    };     

    async addItemById(id) {
        try {
            id = id.toString();
            const item = await Item.findById(id);
            if (item) {
                if (!this.items.has(id)) {
                    this.items.set(item._id, item);
                    logger.info(`itemManager added ${item.name} to items.`);
                    return item;
                } else {
                    logger.warn(`Item with id ${id} already exists in items.`);
                    return null;
                }
            } else {
                logger.error(`itemManager couldn't add item with id ${id} to items.`);
            }
        } catch (err) {
            logger.error(`Error in addItemById: ${err.message}`);
            throw err;
        }
    }
    
    async getItemById(id) {
        try {
            id = id.toString();
            const item = this.items.get(id.toString());
            if (item) {
                return item;
            } else {
                logger.error(`itemManager can't find item with id: ${id}.`);
                return null;
            };
        } catch(err) {
            logger.error(`Error in getItemById: ${err.message}`);
            throw err;
        }
    }

    async removeItemById(id) {
        try {
            id = id.toString();
            //logger.debug(`Removing item with id "${id}"`);
            if (this.items.has(id)) {
                this.items.delete(id);
            } else {
                logger.warn(`Item with id "${id}" does not exist.`);
            }
            //logger.info(`Item Removed. Active items remaining: ${JSON.stringify(Array.from(this.items.values()).map(item => item.name))}`)
        } catch(err) {
            logger.error(`Error in removeItemById: ${err.message}`);
            throw err;
        };
    }

    clearContents() {
        this.items = []
        worldEmitter.off('inventoryDestroyingItem', removingItemHandler);
        worldEmitter.off('inventoryRequestingNewItem', inventoryRequestingNewItemHandler);
        worldEmitter.off('characterLoadingItem', loadingItemHandler);
        worldEmitter.off('characterRemovingItem', removingItemHandler);
    }
}

export default ItemManager;