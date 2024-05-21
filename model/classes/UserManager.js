import UserRepository from './UserRepository.js';

class UserManager {
    constructor() {
        this.userInstances = new Map();  // Stores all zones by their unique ID
        this.userRepository = new UserRepository(); //data access layer
    };

    async instantiateUserByUsername(username) {
        try {
            const storedUser = await this.userRepository.retrieveStoredUserByUsername(username);
            this.userInstances.set(user.username, user);
            const user = new User(storedUser);
            if (!user) {
                throw new Error(`Couldn't make a User from the storedUser with username: "${username}".`);
            }
            return user;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

}