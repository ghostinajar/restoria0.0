import logger from "../../logger.js";
import initRuntimePropsForAgent from "../../util/initRuntimePropsForAgent.js";
import User, { IUser } from "./User.js";
import worldEmitter from "./WorldEmitter.js";
import mongoose from "mongoose";

class UserManager {
  constructor() {
    this.users = new Map(); // Stores all users with their _id.toString() as key

    worldEmitter.on(`requestingUser`, this.requestingUserHandler);
    worldEmitter.on(`requestingWhoArray`, this.requestingWhoArrayHandler);
    worldEmitter.on(`socketCheckingMultiplay`,this.socketCheckingMultiplayHandler);
    worldEmitter.on(`socketConnectingUser`, this.socketConnectingUserHandler);
    worldEmitter.on(`zoneManagerRemovedUser`, this.logoutUserHandler);
  }

  //key is user's _id.toString()
  users: Map<string, IUser>;

  logoutUserHandler = (user: IUser) => {
    logger.debug(`logoutUserHandler called`);
    logger.debug(
      `Users before removal: ${Array.from(this.users.values()).map(
        (user) => user.username
      )}`
    );
    this.removeUserById(user._id);
    logger.debug(
      `Users after removal: ${Array.from(this.users.values()).map(
        (user) => user.username
      )}`
    );
  };

  requestingUserHandler = async (username: string) => {
    logger.debug(`worldEmitter received 'requestingUser' and ${username}, checking...`);
    const user = await this.getUserByUserName(username);
    if (!user) {
        logger.error(`requestingUserHandler couldn't find user ${username}`);
        worldEmitter.emit(`userManagerReturningUser${username}`, null);
        return;
    }
    worldEmitter.emit(`userManagerReturningUser${user.username}`, user);
};


  requestingWhoArrayHandler = async (username : string) => {
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
    worldEmitter.emit(`userManagerReturningWhoArrayFor${username}`, whoArray);
  };

  socketCheckingMultiplayHandler = (id: mongoose.Types.ObjectId) => {
    logger.debug(
      `worldEmitter received 'socketCheckingMultiplay' and ${id}, checking...`
    );
    const isDuplicate = this.users.has(id.toString());
    logger.debug(
      `worldEmitter sending userManagerCheckedMultiplay with value ${isDuplicate}...`
    );
    worldEmitter.emit(`userManagerCheckedMultiplayFor${id}`, isDuplicate);
  };

  socketConnectingUserHandler = async (id: mongoose.Types.ObjectId) => {
    logger.debug(
      `worldEmitter received 'socketConnectingUser' and ${id}, checking...`
    );
    const user = await this.addUserById(id);
    if (!user) {
      logger.error(`socketConnectingUserHandler couldn't addUserById ${id}`);
      return;
    }
    logger.debug(
      `worldEmitter sending 'userManagerAddedUser' and user object for ${user.name}...`
    );
    worldEmitter.emit(`userManagerAddedUser`, user);
  };

  async addUserById(id: mongoose.Types.ObjectId) {
    try {
      if (this.users.has(id.toString())) {
        return this.users.get(id.toString());
      }
      const user = await User.findById(id);
      if (user) {
        initRuntimePropsForAgent(user);
        logger.debug(`User's runtime props on init: ${JSON.stringify(user.runtimeProps)}`);
        this.users.set(user._id.toString(), user);
        logger.debug(`userManager added ${user.name} to users.`);
        logger.debug(
          `Active users: ${JSON.stringify(
            Array.from(this.users.values()).map((user) => user.name)
          )}`
        );
        return user;
      } else {
        logger.error(`userManager couldn't add user with id ${id} to users.`);
      }
    } catch (err: any) {
      logger.error(`Error in addUserById: ${err.message}`);
      throw err;
    }
  }

  async getUserByUserName(username: string) {
    try {
      for (let user of this.users.values()) {
        if (user.username === username.toLowerCase()) {
          return user;
        }
      }
      logger.warn(`No user in userManager.users by the name ${username}.`);
      return null;
    } catch (err: any) {
      logger.error(`Error in getUserByUserName: ${err.message}`);
    }
  }

  async removeUserById(id: mongoose.Types.ObjectId) {
    try {
      this.users.delete(id.toString());
      logger.info(
        `Active users: ${JSON.stringify(
          Array.from(this.users.values()).map((user) => user.name)
        )}`
      );
    } catch (err: any) {
      logger.error(`Error in removeUserById: ${err.message}`);
      throw err;
    }
  }

  clearContents() {
    this.users.clear;
    worldEmitter.off(`requestingUser`, this.requestingUserHandler);
    worldEmitter.off(`requestingWhoArray`, this.requestingWhoArrayHandler);
    worldEmitter.off(
      `socketCheckingMultiplay`,
      this.socketCheckingMultiplayHandler
    );
    worldEmitter.off(`socketConnectingUser`, this.socketConnectingUserHandler);
    worldEmitter.off(`zoneManagerRemovedPlayer`, this.logoutUserHandler);
  }
}

export default UserManager;
