import logger from '../../logger.js';
import worldEmitter from './WorldEmitter.js';
import mongoose from 'mongoose';
import Mob, { IMob } from './Mob.js';
import { IMobBlueprint } from './MobBlueprint.js';

class MobManager {
    constructor() {
        this.mobs = new Map();  // Stores all mobs with their _id.toString() as key
        worldEmitter.on('roomDestroyingMob', this.removingMobHandler);
        worldEmitter.on('roomRequestingNewMob', this.roomRequestingNewMobHandler);
    };     

    mobs : Map<string, IMob> | null;

    roomRequestingNewMobHandler = async (blueprint : IMobBlueprint) => {
        if (!this.mobs) {return null};
        // Create a copy of the blueprint and give its own unique Id
        const mob = new Mob(blueprint);
        this.mobs.set(mob._id.toString(), mob);
        logger.log(`debug`, `mobManager added ${mob.name} to mobs. Mobs after adding: ${JSON.stringify(Array.from(this.mobs.values()).map(mob => mob.name))}`);
        worldEmitter.emit('mobManagerAddedMob', mob);
    }

    removingMobHandler = async (mobId : string) => {
        logger.debug(`removingMobHandler called...`)
        logger.debug(`removingMobHandler removing mob with id: ${mobId}`)
        await this.removeMobById(mobId);
        worldEmitter.emit(`mobManagerRemovedMob${mobId}`)
    };

    async getMobById(id : string) {
        try {
            if (!this.mobs) {return null};
            const mob = this.mobs.get(id.toString());
            if (mob) {
                return mob;
            } else {
                logger.error(`mobManager can't find mob with id: ${id}.`);
                return null;
            };
        } catch(err : any) {
            logger.error(`Error in getMobById: ${err.message}`);
            throw err;
        }
    }

    async removeMobById(id : string) {
        try {
            if (!this.mobs) {return null};
            logger.debug(`Removing mob with id "${id}"`);
            if (this.mobs.has(id)) {
                this.mobs.delete(id);
            } else {
                logger.warn(`Mob with id "${id}" does not exist.`);
            }
            //logger.info(`Mob Removed. Active mobs remaining: ${JSON.stringify(Array.from(this.mobs.values()).map(mob => mob.name))}`)
        } catch(err : any) {
            logger.error(`Error in removeMobById: ${err.message}`);
            throw err;
        };
    }

    clearContents() {
        this.mobs = null
        worldEmitter.off('roomDestroyingMob', this.removingMobHandler);
        worldEmitter.off('roomRequestingNewMob', this.roomRequestingNewMobHandler);
    }
}

export default MobManager;