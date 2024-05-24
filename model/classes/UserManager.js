import UserRepository from './UserRepository.js';
import logger from '../../logger.js';

class UserManager {
    constructor() {
        this.users = new Map();  // Stores all users with their ObjectId as key
        this.userRepository = new UserRepository(); //data access layer
    };

    async addUserById(id) {
        try {
            //make sure id is an ObjectId object
            const user = await this.userRepository.retrieveUserById(id);
            if (user) {
                //logger.info(`userManager.userRepository retrieved ${user.username}, id: ${user._id}.`);
                this.users.set(user._id, user);
                //logger.info(`userManager added ${user.username} to users.`);
                return user;
            } else {
                logger.error(`userManager couldn't add user with id ${id} to users.`)
            }
        } catch(err) {throw err};
    }

    async getUserById(id) {
        try {
            //make sure id is an ObjectId object
            const user = this.users.get(id);
            if (user) {
                //logger.info(`userManager got ${user.username} from users.`);
                return user;
            } else {
                logger.info(`userManager can't find user with id: ${id}.`);
                return null;
            };
        } catch(err) {
            throw err;
        }
    }

    async removeUserById(id) {
        try {
            //make sure id is an ObjectId object
            this.users.delete(id);
            logger.info(`userManager deleted user with id ${id} from users.`)
        } catch(err) {throw err};
    }
}

export default UserManager;
