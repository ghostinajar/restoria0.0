import logger from '../../logger.js';
import Item from './Item.js';
import worldEmitter from './WorldEmitter.js';

class ItemManager {
    constructor() {
        this.items = new Map();  // Stores all items with their _id.toString() as key
        
        const loadingItemResponder = async (id) => {
            logger.info(`worldEmitter received 'loadingItem' and ${id}, checking...`)
            const item = await this.addItemById(id);
            logger.info(`worldEmitter sending 'itemManagerAddedItem' and ${item.name}...`)
            worldEmitter.emit('itemManagerAddedItem', item);
        };

        const removingItemResponder = (item) => {
            logger.debug(`removingItemResponder called...`)
            logger.debug(`Items before removal: ${Array.from(this.items)}`)
            this.removeItemById(item._id.toString());
            logger.debug(`Items after removal: ${Array.from(this.items)}`)

        };

        worldEmitter.on('loadingItem', loadingItemResponder);
        worldEmitter.on('removingItem', removingItemResponder);
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
        worldEmitter.off('loadingItem', loadingItemResponder);
        worldEmitter.off('removingItem', removingItemResponder);
    }
}

export default ItemManager;