import logger from '../../logger.js';
import User from './User.js';
import worldEmitter from './WorldEmitter.js';
import Name from './Name.js'

class UserManager {
    constructor() {
        this.users = new Map();  // Stores all users with their _id.toString() as key
        const socketCheckingMultiplayHandler = (id) => {
            //logger.debug(`worldEmitter received 'socketCheckingMultiplay' and ${id}, checking...`)
            const isDuplicate = this.users.has(id.toString());
            //logger.debug(`worldEmitter sending userManagerCheckedMultiplay with value ${isDuplicate}...`)
            worldEmitter.emit('userManagerCheckedMultiplay', isDuplicate);
        };

        const socketConnectingUserHandler = async (id) => {
            //logger.debug(`worldEmitter received 'socketConnectingUser' and ${id}, checking...`)
            const user = await this.addUserById(id.toString());
            //logger.debug(`worldEmitter sending 'userManagerAddedUser' and ${user.username}...`)
            worldEmitter.emit('userManagerAddedUser', user);
        };

        const logoutUserHandler = (user) => {
            //logger.debug(`logoutUserHandler called`)
            //logger.debug(`Users before removal: ${Array.from(this.users)}`)
            this.removeUserById(user._id);
            //logger.debug(`Users after removal: ${Array.from(this.users)}`)

        };

        worldEmitter.on('socketCheckingMultiplay', socketCheckingMultiplayHandler);
        worldEmitter.on('socketConnectingUser', socketConnectingUserHandler);
        worldEmitter.on('zoneManagerRemovedPlayer', logoutUserHandler);
    };

    async addUserById(id) {
        try {
            const user = await User.findById(id);
            if (user) {
                if (!this.users.has(id.toString())) {
                    this.users.set(user._id.toString(), user);
                    //logger.info(`userManager added ${user.username} to users.`);
                    return user;
                } else {
                    logger.warn(`User with id ${id} already exists in users.`);
                    return null;
                }
            } else {
                logger.error(`userManager couldn't add user with id ${id} to users.`);
            }
        } catch (err) {
            logger.error(`Error in addUserById: ${err.message}`);
            throw err;
        }
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
            logger.error(`Error in getUserById: ${err.message}`);
            throw err;
        }
    }

    async removeUserById(id) {
        try {
            this.users.delete(id.toString());
            logger.info(`Active users: ${JSON.stringify(Array.from(this.users.values()).map(user => user.username))}`)
        } catch(err) {
            logger.error(`Error in removeUserById: ${err.message}`);
            throw err;
        };
    }

    async deleteUserByName(name) {
        // Delete from users collection
        try {
            await User.deleteOne({ username: name.toLowerCase() });
            logger.info(`User ${name} deleted successfully.`);
          } catch (error) {
            logger.error('Error in deleteUserByName:', error);
          }          
        // Delete from names collection
        try {
            await Name.deleteOne({ name: name.toLowerCase() });
            console.log(`Name ${name} deleted successfully.`);
          } catch (error) {
            logger.error('Error in deleteUserByName:', error);
          }          
    }

    clearContents() {
        this.users = []
        worldEmitter.off('socketCheckingMultiplay', socketCheckingMultiplayHandler);
        worldEmitter.off('socketConnectingUser', socketConnectingUserHandler);
        worldEmitter.off('zoneManagerRemovedPlayer', logoutUserHandler);
    }
}

export default UserManager;