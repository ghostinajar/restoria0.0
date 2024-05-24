import UserRepository from './UserRepository.js';
import logger from '../../logger.js';

class UserManager {
    constructor() {
        this.users = new Map();  // Stores all users with their _id.toString() as key
        this.userRepository = new UserRepository(); //data access layer
    };

    async addUserById(id) {
        try {
            const user = await this.userRepository.retrieveUserById(id);
            if (user) {
                this.users.set(user._id.toString(), user);
                logger.info(`userManager added ${user.username} to users.`);
                return user;
            } else {
                logger.error(`userManager couldn't add user with id ${id} to users.`)
            }
        } catch(err) {throw err};
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
        } catch(err) {
            throw err;
        }
    }

    async removeUserById(id) {
        try {
            this.users.delete(id.toString());
            logger.info(`userManager deleted user with id ${id} from users.`)
        } catch(err) {throw err};
    }
}


export default UserManager;
