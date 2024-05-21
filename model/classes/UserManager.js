import UserRepository from './UserRepository.js';

class UserManager {
    constructor() {
        this.userInstances = new Map();  // Stores all zones by their unique ID
        this.userRepository = new UserRepository(); //data access layer
    };

    async instantiateUserByUsername(username) {
        try {
            const user = await this.userRepository.instantiateUserByUsername(username);
            this.userInstances.set(user.username, user);
            return user;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

}