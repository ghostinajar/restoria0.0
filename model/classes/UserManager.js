import UserRepository from './UserRepository.js';

class UserManager {
    constructor() {
        this.userInstances = new Map();  // Stores all zones by their unique ID
        this.userRepository = new UserRepository(); //data access layer
    };
}

export default UserManager;