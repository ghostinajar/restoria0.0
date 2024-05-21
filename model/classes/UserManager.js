import UserRepository from './UserRepository.js';
import User from './User.js';

class UserManager {
    constructor() {
        this.userInstances = new Map();  // Stores all zones by their unique ID
        this.userRepository = new UserRepository(); //data access layer
    };

    //TODO addUser function, etc

}

export default UserManager;
