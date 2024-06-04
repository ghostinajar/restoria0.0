import logger from '../../logger.js';
import worldEmitter from './WorldEmitter.js';
import mongoose from 'mongoose';
import Mob from './Mob.js';

class MobManager {
    constructor() {
        this.mobs = new Map();  // Stores all mobs with their _id.toString() as key

        const roomRequestingNewMobHandler = async (blueprint) => {
            // Create a copy of the blueprint and give its own unique Id
            const mob = new Mob(blueprint);
            mob._id = new mongoose.Types.ObjectId();
            this.mobs.set(mob._id.toString(), mob);
            //logger.debug(`mobManager added ${mob.name} to mobs. Mobs after adding: ${JSON.stringify(Array.from(this.mobs.values()).map(mob => mob.name))}`);
            worldEmitter.emit('mobManagerAddedMob', mob);
        }

        const removingMobHandler = async (mobId) => {
            logger.debug(`removingMobHandler called...`)
            logger.debug(`removingMobHandler removing mob with id: ${mobId}`)
            await this.removeMobById(mobId);
            worldEmitter.emit('mobManagerRemovedMob')
        };

        worldEmitter.on('roomDestroyingMob', removingMobHandler);
        worldEmitter.on('roomRequestingNewMob', roomRequestingNewMobHandler);
    };     

    async getMobById(id) {
        try {
            id = id.toString();
            const mob = this.mobs.get(id.toString());
            if (mob) {
                return mob;
            } else {
                logger.error(`mobManager can't find mob with id: ${id}.`);
                return null;
            };
        } catch(err) {
            logger.error(`Error in getMobById: ${err.message}`);
            throw err;
        }
    }

    async removeMobById(id) {
        try {
            id = id.toString();
            //logger.debug(`Removing mob with id "${id}"`);
            if (this.mobs.has(id)) {
                this.mobs.delete(id);
            } else {
                logger.warn(`Mob with id "${id}" does not exist.`);
            }
            logger.info(`Mob Removed. Active mobs remaining: ${JSON.stringify(Array.from(this.mobs.values()).map(mob => mob.name))}`)
        } catch(err) {
            logger.error(`Error in removeMobById: ${err.message}`);
            throw err;
        };
    }

    clearContents() {
        this.mobs = []
        worldEmitter.on('roomDestroyingMob', removingMobHandler);
        worldEmitter.on('roomRequestingNewMob', roomRequestingNewMobHandler);
    }
}

export default MobManager;