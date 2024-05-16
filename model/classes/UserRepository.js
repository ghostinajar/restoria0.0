import User from "./User";
import StoredUser from "../data_access/StoredUser";

class UserRepository {
    constructor() {
    }
    
    async instantiateUserbyId(id) {
        try {
            const storedUser = await StoredUser.findById(id);
            if (!storedUser) {
                throw new Error("Couldn't find a User id");
            }
            const user = new User(storedUser);
            if (!user) {
                throw new Error("Couldn't make a User from the StoredUser");
            }
            return new User(storedUser);

        } catch (error) {
            console.log(error);
        }
    }
    
    async getStoredUserByUsername(username) {
        try {
            const storedUser = await this.User.findOne({ username });
            if (!storedUser) {
                throw new Error("No StoredUser found with that id");
            }
            return user;
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