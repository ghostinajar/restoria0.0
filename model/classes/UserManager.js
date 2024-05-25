import logger from '../../logger.js';
import User from './User.js';

class UserManager {
    constructor() {
        this.users = new Map();  // Stores all users with their _id.toString() as key
    };

    async addUserById(id) {
        try {
            const user = await User.findById(id);
            if (user) {
                if (!this.users.has(user._id.toString())) {
                    this.users.set(user._id.toString(), user);
                    logger.info(`userManager added ${user.username} to users.`);
                } else {
                    logger.warn(`User with id ${id} already exists in users.`);
                }
                logger.info(`users map: ${JSON.stringify(Array.from(this.users))}`);
                return user;
            } else {
                logger.error(`userManager couldn't add user with id ${id} to users.`);
            }
        } catch (err) {throw err}
    }
    
    async getUserById(id) {
        try {
            const user = this.users.get(id.toString());
            if (user) {
                return user;
            } else {
                logger.error(`userManager can't find user with id: ${id}.`);
                return null;
            };
        } catch(err) {throw err;}
    }

    async removeUserById(id) {
        try {
            this.users.delete(id.toString());
            logger.info(`userManager deleted user with id ${id} from users.`)
        } catch(err) {throw err};
    }
}


export default UserManager;
