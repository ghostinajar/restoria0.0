class Room {
    constructor(id) {
        this.id = id;
        this.mobs = [];  // Stores IDs of mobs in this room
        this.items = [];  // Stores IDs of items in this room
        this.users = [];  // Stores IDs of users in this room
        this.characters = [];  // Stores IDs of characters in this room
    }

    addMob(mob) {
        this.mobs.push(mob.id);
    }

    addItem(item) {
        this.items.push(item.id);
    }
}