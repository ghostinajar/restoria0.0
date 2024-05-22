import UserRepository from './UserRepository.js';
import logger from '../../logger.js';
import mongoose from 'mongoose';

class UserManager {
    constructor() {
        this.users = new Map();  // Stores all users with their ObjectId as key
        this.userRepository = new UserRepository(); //data access layer
    };

    ensureIdIsObjectId(id) {
        if (typeof id === 'string') {
            logger.info(`id was a string, converting to ObjectId`);
            id = new mongoose.Types.ObjectId(id);
            logger.info(`id is now ${typeof id}`);
        }
    }

    async addUserById(id) {
        try {
            this.ensureIdIsObjectId(id);
            const user = await this.userRepository.retrieveUserById(id);
            logger.info(`userManager.userRepository retrieved ${user.username}, id: ${user._id}.`);
            this.users.set(user._id, user);
            logger.info(`Added to usermanager.users ${user.username}, id: ${user._id}.`);
            return user;
        } catch(err) {throw err};
    }

    async getUserById(id) {
        try {
            this.ensureIdIsObjectId(id);
            const user = this.users.get(id);
            if (user) {
                logger.info(`Got user from UserManager ${user.username}, id: ${user._id} id Type ${typeof user._id}`);
                return user;
            } else {
                logger.info(`No user found with id: ${id}. Type of id ${typeof id}`);
                return null;
            };
        } catch(err) {
            throw err;
        }
    }

    async removeUserById(id) {
        try {
            this.ensureIdIsObjectId(id);
            this.users.delete(id);
            logger.info(`Deleted from userManager.users user with id ${id}.`)
        } catch(err) {throw err};
    }
}

export default UserManager;
