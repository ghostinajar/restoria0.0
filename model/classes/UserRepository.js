import StoredUser from '../data_access/StoredUser.js';

/* Data access layer for User objects. 
Can retrieve, instantiate, update, create, delete StoredUser records from db */

class UserRepository {
    constructor() {
        this.testProp = 'User Repository exists!'
    }

    async retrieveStoredUserByUsername(username) {
        try {
            const storedUser = await StoredUser.findOne({ username });
            if (!storedUser) {
                throw new Error(`Couldn't retrieve storedUser with username: "${username}" in the db.`);
            }
            return storedUser;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    
    async instantiateUserByUsername(username) {
        try {
            const storedUser = await this.retrieveStoredUserByUsername(username);
            const user = new User(storedUser);
            if (!user) {
                throw new Error(`Couldn't make a User from the StoredUser with username: "${username}".`);
            }
            return user;

        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    
    async updateStoredUser(user) {
        try {
            return await StoredUser.findByIdAndUpdate(user._id, user, { new: true });
        } catch (error) {
            throw error;
        }
    }

/* NOT SURE IF NEEDED

    async createStoredUser(newUser) {
        try {
            const storedUser = new StoredUser(newUser);
            return await storedUser.save();
        } catch (error) {
            throw error; 
        }
    }
*/

    async deleteStoredUserById(id) {
        try {
            return await StoredUser.findByIdAndDelete(id); 
        } catch (error) {
            throw error; 
        }
    }
}

export default UserRepository;