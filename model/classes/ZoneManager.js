import logger from '../../logger.js';
import Zone from './Zone.js';
import worldEmitter from './WorldEmitter.js';

class ZoneManager {
    constructor() {
        this.zones = new Map();

        //placing player in location on login
        const playerLoginHandler = async (player) => {
            let {inRoom, inZone} = player.location;
            if (!inRoom || !inZone) {
                logger.error('Player location missing, reset to worldRecall.');
                player.location = {inZone: '664f8ca70cc5ae9b173969a8', inRoom: '66516e71db5355ed8ff39f59'};
                player.save()
                inRoom = player.location.inRoom;
                inZone = player.location.inZone;
            }
            let zone;
            let room;
            //if zone isn't loaded, load it
            if (!this.zones.has(inZone.toString())) { 
                try {
                    zone = await this.addZoneById(inZone.toString());
                    //logger.debug(`Finding player location, zone: ${zone}`)
                } catch (error) {
                    logger.error('Player location reset to worldRecall, due to error loading zone:', error);
                    player.location = {inZone: '664f8ca70cc5ae9b173969a8', inRoom: '66516e71db5355ed8ff39f59'};
                }
            } else {
                zone = this.zones.get(inZone.toString());
                //logger.debug(`Finding player location, zone: ${zone.name}`)
            }
            //find room
            if (zone) {
                room = zone.rooms.find(room => room._id.toString() == inRoom.toString());
                //logger.debug(`Finding player location, room: ${room.name}`)
            }
            //put player in location, else at world recall
            if (zone && room) {
                room.addEntityTo('players', player);
                //logger.debug(`Player placed in location! Room.players: ${room.players.map(player => player.name)}`);
            } else {
                player.location = {inZone: '664f8ca70cc5ae9b173969a8', inRoom: '66516e71db5355ed8ff39f59'};
                logger.debug('Player location reset to worldRecall, due to failure loading location.');
            }
        }

        const playerLogoutHandler = async (player) => {
            //logger.debug(`playerLogoutHandler called`)
            let {inRoom, inZone} = player.location;
            let zone = this.zones.get(inZone.toString());
            let room = zone.rooms.find(room => room._id.toString() == inRoom.toString());
          
            //remove player from location
            if (zone && room) {
                //logger.debug(`Room.players before removal: ${room.players.map(player => player.name)}`)
                room.removeEntityFrom('players', player);
                //logger.debug(`Player removed from location. Room.players: ${room.players.map(player => player.name)}`);
            } else {
                logger.error('Player location not found at logout!');
            }
            worldEmitter.emit('playerRemoved', player);
        }
        
        worldEmitter.on('userLogin', playerLoginHandler);
        worldEmitter.on('userDisconnected', playerLogoutHandler);

    };

    async addZoneById(id) {
        try {
            const zone = await Zone.findById(id);
            //if zone exists and isn't already in zones map
            if (zone && !this.zones.has(zone._id.toString())) {  
                // add zone to zones map        
                this.zones.set(zone._id.toString(), zone);
                logger.info(`zoneManager added ${zone.name} to zones.`);
                logger.info(`Active zones: ${JSON.stringify(Array.from(this.zones.values()).map(zone => zone.name))}`);
                await zone.initRooms();
                return zone;
            } else {
                logger.error(`zoneManager couldn't add zone with id ${id} to zones.`)
                return zone;
            }
        } catch(err) {
            logger.error(`Error in addZoneById: ${err.message}`);
            throw err;
        };
    }

    async getZoneById(id) {
        try {
            const zone = this.zones.get(id.toString());
            if (zone) {
                return zone;
            } else {
                logger.info(`zoneManager can't find zone with id: ${id}.`);
                return null;
            };
        } catch(err) {
            logger.error(`Error in getZoneById: ${err.message}`);
            throw err;
        }
    }

    async removeZoneById(id) {
        try {
            const zone = this.zones.get(id.toString());
            if (zone) {
                zone.removeFromWorld()
                logger.info(`Removing zone "${zone.name}" from zones...`)
                this.zones.delete(id.toString());
                logger.info(`Active zones: ${JSON.stringify(Array.from(this.zones.values()).map(zone => zone.name))}`);
            } else {
                logger.warn(`Zone with id ${id} does not exist in zones.`);
            }
        } catch(err) {
            logger.error(`Error in removeZoneById: ${err.message}`);
            throw err;
        }
    }

    clearContents() {
        this.zones = [];
        worldEmitter.off('userLogin', playerLoginHandler);
        worldEmitter.off('userDisconnected', playerLogoutHandler);
    }
    
}

export default ZoneManager;