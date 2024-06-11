import logger from "../../logger.js";
import User from "./User.js";
import worldEmitter from "./WorldEmitter.js";
import Name from "./Name.js";

class UserManager {
  constructor() {
    this.users = new Map(); // Stores all users with their _id.toString() as key

    const logoutUserHandler = (user) => {
      logger.debug(`logoutUserHandler called`)
      logger.debug(`Users before removal: ${Array.from(this.users).map(user => user.username)}`)
      this.removeUserById(user._id);
      logger.debug(`Users after removal: ${Array.from(this.users).map(user => user.username)}`)
    };

    const requestingUserHandler = (username) => {
      //logger.debug(`worldEmitter received 'requestingUser' and ${name}, checking...`
      const user = this.getUserByUserName(username);
      //logger.debug(`worldEmitter sending userManagerReturningUser with value ${user}...`)
      worldEmitter.emit(`userManagerReturningUser`, user);
    };

    const requestingWhoArrayHandler = async () => {
      let whoArray = [];
      // Populate array with all online players's level, job, name
      for (let user of this.users.values()) {
        let whoObject = {
          level: user.level,
          job: user.job,
          name: user.name,
        };
        whoArray.push(whoObject);
      }
      worldEmitter.emit(`userManagerReturningWhoArray`, whoArray);
    };

    const socketCheckingMultiplayHandler = (id) => {
      logger.debug(`worldEmitter received 'socketCheckingMultiplay' and ${id}, checking...`)
      const isDuplicate = this.users.has(id.toString());
      logger.debug(`worldEmitter sending userManagerCheckedMultiplay with value ${isDuplicate}...`)
      worldEmitter.emit(`userManagerCheckedMultiplay`, isDuplicate);
    };

    const socketConnectingUserHandler = async (id) => {
      logger.debug(`worldEmitter received 'socketConnectingUser' and ${id}, checking...`)
      const user = await this.addUserById(id.toString());
      if (!user) {
        logger.error(`socketConnectingUserHandler couldn't addUserById ${id}`)
        return;
      }
      logger.debug(`worldEmitter sending 'userManagerAddedUser' and user object for ${user.name}...`)
      worldEmitter.emit(`userManagerAddedUser`, user);
    };

    worldEmitter.on(`requestingUser`, requestingUserHandler);
    worldEmitter.on(`requestingWhoArray`, requestingWhoArrayHandler);
    worldEmitter.on(`socketCheckingMultiplay`, socketCheckingMultiplayHandler);
    worldEmitter.on(`socketConnectingUser`, socketConnectingUserHandler);
    worldEmitter.on(`zoneManagerRemovedPlayer`, logoutUserHandler);
  }

  async addUserById(id) {
    try {
      const user = await User.findById(id);
      if (user) {
        if (!this.users.has(id.toString())) {
          this.users.set(user._id.toString(), user);
          logger.debug(`userManager added ${user.name} to users.`);
          logger.debug(`active users: ${Array.from(this.users).map(user => user.name)}`);
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

  async getUserByUserName(username) {
    try {
      for (let user of this.users.values()) {
        if (user.username === username.toLowerCase()) {
          return user;
        }
      }
      logger.warn(`No user in userManager.users by the name ${username}.`);
      return null;
    } catch (err) {
      logger.error(`Error in getUserByUserName: ${err.message}`);
    }
  }

  async removeUserById(id) {
    try {
      this.users.delete(id.toString());
      logger.info(
        `Active users: ${JSON.stringify(
          Array.from(this.users.values()).map((user) => user.name)
        )}`
      );
    } catch (err) {
      logger.error(`Error in removeUserById: ${err.message}`);
      throw err;
    }
  }

  clearContents() {
    this.users = [];
    worldEmitter.off(`requestingUser`, requestingUserHandler);
    worldEmitter.off(`requestingWhoArray`, requestingWhoArrayHandler);
    worldEmitter.off(`socketCheckingMultiplay`, socketCheckingMultiplayHandler);
    worldEmitter.off(`socketConnectingUser`, socketConnectingUserHandler);
    worldEmitter.off(`zoneManagerRemovedPlayer`, logoutUserHandler);
  }
}

export default UserManager;
