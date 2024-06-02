import logger from '../../logger.js';
import Zone from './Zone.js';
import worldEmitter from './WorldEmitter.js';
import resetPlayerLocation from '../../util/resetPlayerLocation.js';

class ZoneManager {
    constructor() {
        this.zones = new Map();      
        
        const userManagerAddedPlayerHandler = async (player) => {
            this.placePlayerInLocation(player)
        }
        
        const playerLogoutHandler = async (player) => {
            //logger.debug(`playerLogoutHandler called`)
            //find player's location on logout
            let {inRoom, inZone} = player.location;
            let zone = this.zones.get(inZone.toString());
            let room = zone.rooms.find(room => room._id.toString() == inRoom.toString());
          
            //remove player from location
            if (zone && room) {
                //logger.debug(`Room.players before removal: ${room.players.map(player => player.name)}`)
                room.removeEntityFrom('players', player);
                worldEmitter.emit('zoneManagerRemovedPlayer', player);
                //logger.debug(`Player removed from location. Room.players: ${room.players.map(player => player.name)}`);
            } else {
                resetPlayerLocation(player, 'Player location not found at logout! Reset to world recall.');
            }
        }
        
        worldEmitter.on('userManagerAddedUser', userManagerAddedPlayerHandler);
        worldEmitter.on('socketDisconnectedUser', playerLogoutHandler);

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

    async placePlayerInLocation(player) {
        // Missing location? Reset to world recall
        if (!player.location.inRoom || !player.location.inZone) {
            player.location = await resetPlayerLocation(player, 'Player location missing, reset to worldRecall.');
        }
        // Zone isn't loaded? Load it
        let zone = this.zones.get(player.location.inZone.toString());
        // Zone doesn't exist? Reset to world recall.
        if (!zone) {
            player.location = await resetPlayerLocation(player, 'Player location zone missing, reset to worldRecall.');
            zone = this.zones.get(player.location.inZone.toString());
        }
        // Find room
        const room = zone.rooms.find(room => room._id.toString() == player.location.inRoom.toString())
        // Room doesn't exist? Reset to world recall.
        if (!room) {
            player.location = await resetPlayerLocation(player, 'Player location room missing, reset to worldRecall.');
            zone = this.zones.get(player.location.inZone.toString());
            room = zone.rooms.find(room => room._id.toString() == player.location.inRoom.toString())
        }
        // Place player in room
        room.addEntityTo('players', player);
        logger.info(`Player ${player.name} placed in ${room.name}.`)
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
        worldEmitter.off('userManagerAddedUser', userManagerAddedPlayerHandler);
        worldEmitter.off('socketDisconnectedUser', playerLogoutHandler);
    }
    
}

export default ZoneManager;