import Zone from './Zone.js';

/* Data access layer for Zone objects. 
Can create, retrieve, save, or delete Zone records from db */

class ZoneRepository {
    constructor() {
    }

    async retrieveZone(id) {
        try {
            return await Zone.findById(id);
        } catch (error) {throw error;};
    }
    
    async saveZone(zone) {
        try {
            return await zone.save();
        } catch (error) {throw error;}
    }

    async createZone(zoneName, authorId) {
        try {
            const zone = new Zone({name: zoneName, author: authorId});
            zone.history.creationDate = new Date();
            return await zone.save();
        } catch (error) {throw error;}
    }

    async deleteZoneById(id) {
        try {
            return await Zone.findByIdAndDelete(id); 
        } catch (error) {throw error;}
    }
}

export default ZoneRepository;