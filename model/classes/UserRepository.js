import User from "./User";
import { StoredUser } from "../data_access/StoredUser";

/* Data access layer for User objects. 
Can retrieve, instantiate, update, create, delete StoredUser records from db */

class UserRepository {
    constructor() {
    }

    async retrieveStoredUserByUsername(username) {
        try {
            const storedUser = await StoredUser.findOne({ username });
            if (!storedUser) {
                throw new Error(`Couldn't find storedUser with username: "${username}" in the db.`);
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
            console.log("Database returned an error on updateStoredUser:", error);
            throw error;
        }
    }

    async createStoredUser(newUser) {
        try {
            const storedUser = new StoredUser(newUser);
            return await storedUser.save();
        } catch (error) {
            console.log("Database returned an error on createStoredUser:", error);
            throw error; 
        }
    }
    
    async deleteStoredUserById(id) {
        try {
            return await StoredUser.findByIdAndDelete(id); 
        } catch (error) {
            console.log("Database returned an error on deleteStoredUser:", error);
            throw error; 
        }
    }
}

export default UserRepository;