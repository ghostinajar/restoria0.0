import User from './StoredUser.js';

/* Data access layer for User objects. 
Can retrieve, instantiate, update, create, delete StoredUser records from db */

class UserRepository {
    constructor() {
    }

    async retrieveUserByUsername(username) {
        try {
            return await User.findOne({ username });
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    
    async saveUser(user) {
        try {
            return await User.save();
        } catch (error) {
            throw error;
        }
    }

    async createUser(newUser) {
        try {
            const user = new StoredUser(newUser);
            return await storedUser.save();
        } catch (error) {
            throw error; 
        }
    }

    async deleteStoredUserById(id) {
        try {
            return await StoredUser.findByIdAndDelete(id); 
        } catch (error) {
            throw error; 
        }
    }
}

export default UserRepository;