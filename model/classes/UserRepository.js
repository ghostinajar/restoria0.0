import User from './User.js';

/* Data access layer for User objects. 
Can create, retrieve, save, or delete User records from db */
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
            return await user.save();
        } catch (error) {
            throw error;
        }
    }

    async createUser(username, password) {
        try {
            //TODO move user creation code from routes.js to here, 
            //and call this method from routes.js
            const user = new User({username: username, password: password});
            user.createdDate = new Date();
            return await user.save();
        } catch (error) {
            throw error; 
        }
    }

    async deleteUserById(id) {
        try {
            return await StoredUser.findByIdAndDelete(id); 
        } catch (error) {
            throw error; 
        }
    }
}

export default UserRepository;