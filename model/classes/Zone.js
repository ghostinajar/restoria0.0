class Zone {
    constructor(id) {
        this.id = id;
        this.rooms = new Map();  // Stores all rooms in this zone by their unique ID
    }

    addRoom(room) {
        this.rooms.set(room.id, room);
    }

    getRoomById(id) {
        return this.rooms.get(id);
    }
}

export default Zone;