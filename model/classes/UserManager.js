import UserRepository from './UserRepository.js';
import User from './User.js';

class UserManager {
    constructor() {
        this.userInstances = new Map();  // Stores all zones by their unique ID
        this.userRepository = new UserRepository(); //data access layer
    };

    /* retrieves a user from the db by username, 
    creates a User instance, adds it to the map, 
    and returns a reference to instance in the map */
    async instantiateUserByUsername(username) {
        try {
            const storedUser = await this.userRepository.retrieveStoredUserByUsername(username);
            const user = new User(storedUser);
            if (!user) {
                throw new Error(`Couldn't make a User from the StoredUser with username: "${username}".`);
            }
            this.addUser(user);
            return this.userInstances.get(user._id);
        } catch (error) {
            throw error;
        }
    }
    
    addUser(user) {
        this.userInstances.set(user._id, user);
    }

    getUserById(id) {
        return this.userInstances.get(id);
    }


}

export default UserManager;