import User from "./User";
import StoredUser from "../data_access/StoredUser";

/* Data access layer for User objects. 
Can retrieve, instantiate, update, create, delete StoredUser records from db */

class UserRepository {
    constructor() {
    }

    async retrieveStoredUser(username) {
        try {
            const storedUser = await this.User.findOne({ username});
            if (!storedUser) {
                throw new Error(`Couldn't find storedUser with username: "${username}" in the db.`);
            }
            return storedUser;
        } catch (error) {
            console.log(error);
        }
    }
    
    async instantiateUser(username) {
        try {
            this.retrieveStoredUser(username);
            const user = new User(storedUser);
            if (!user) {
                throw new Error(`Couldn't make a User from the StoredUser with username: "${username}".`);
            }
            return new User(storedUser);

        } catch (error) {
            console.log(error);
        }
    }
    
    async updateStoredUser(id, updatedUser) {
        return await this.User.findByIdAndUpdate(id, updatedUser, { new: true });
    }
    
    async deleteStoredUser(id) {
        return await this.User.findByIdAndDelete(id);
    }
    }