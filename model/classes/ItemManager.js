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

        const inventoryRequestedNewItemHandler = async (blueprint) => {
            // Create a copy of the blueprint and give its own unique Id
            const item = new Item(blueprint);
            item._id = new mongoose.Types.ObjectId();
            worldEmitter.emit('itemManagerAddedItem', item);
        }

        const removingItemHandler = (item) => {
            //logger.debug(`removingItemHandler called...`)
            //logger.debug(`Items before removal: ${Array.from(this.items)}`)
            this.removeItemById(item._id.toString());
            //logger.debug(`Items after removal: ${Array.from(this.items)}`)

        };

        worldEmitter.on('inventoryRequestedNewItem', inventoryRequestedNewItemHandler)
        worldEmitter.on('loadingItem', loadingItemHandler);
        worldEmitter.on('removingItem', removingItemHandler);
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
            id = id.toString
            this.items.delete(id);
            logger.info(`Active items: ${JSON.stringify(Array.from(this.items.values()).map(item => item.name))}`)
        } catch(err) {
            logger.error(`Error in removeItemById: ${err.message}`);
            throw err;
        };
    }

    clearContents() {
        this.items = []
        worldEmitter.off('inventoryRequestedNewItem', inventoryRequestedNewItemHandler)
        worldEmitter.off('loadingItem', loadingItemHandler);
        worldEmitter.off('removingItem', removingItemHandler);
    }
}

export default ItemManager;