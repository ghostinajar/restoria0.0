// UserManager
// Manages loading and removing active users from the game,
// also responds to events requesting user data
import logger from "../../logger.js";
import catchErrorHandlerForFunction from "../../util/catchErrorHandlerForFunction.js";
import initRuntimePropsForAgent from "../../util/initRuntimePropsForAgent.js";
import User, { IUser } from "./User.js";
import worldEmitter from "./WorldEmitter.js";
import mongoose from "mongoose";

class UserManager {
  constructor() {
    this.users = new Map(); // Stores all users with their _id.toString() as key

    worldEmitter.on(`requestingUser`, this.requestingUserHandler);
    worldEmitter.on(`requestingWhoArray`, this.requestingWhoArrayHandler);
    worldEmitter.on(
      `socketCheckingMultiplay`,
      this.socketCheckingMultiplayHandler
    );
    worldEmitter.on(`socketConnectingUser`, this.socketConnectingUserHandler);
    worldEmitter.on(`zoneManagerRemovedUser`, this.logoutUserHandler);
  }

  users: Map<string, IUser>;

  logoutUserHandler = (user: IUser) => {
    try {
      this.removeUserById(user._id);
    } catch (error: unknown) {
      catchErrorHandlerForFunction("UserManager.logoutUserHandler", error);
    }
  };

  requestingUserHandler = async (username: string) => {
    try {
      const user = await this.getUserByUsername(username);
      if (!user) {
        logger.error(`requestingUserHandler couldn't find user ${username}`);
        worldEmitter.emit(`userManagerReturningUser${username}`, null);
        return;
      }
      worldEmitter.emit(`userManagerReturningUser${user.username}`, user);
    } catch (error: unknown) {
      catchErrorHandlerForFunction("UserManager.requestingUserHandler", error);
    }
  };

  requestingWhoArrayHandler = async (username: string) => {
    try {
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
    } catch (error: unknown) {
      catchErrorHandlerForFunction("functionName", error);
    }
  };

  socketCheckingMultiplayHandler = (id: mongoose.Types.ObjectId) => {
    const isDuplicate = this.users.has(id.toString());
    worldEmitter.emit(`userManagerCheckedMultiplayFor${id}`, isDuplicate);
  };

  socketConnectingUserHandler = async (id: mongoose.Types.ObjectId) => {
    try {
      const user = await this.addUserById(id);
      if (!user) {
        logger.error(`socketConnectingUserHandler couldn't addUserById ${id}`);
        return;
      }
      worldEmitter.emit(`userManagerAddedUser${user._id}`, user);
      worldEmitter.emit(`placeUserRequest`, user);
    } catch (error: unknown) {
      catchErrorHandlerForFunction(
        "UserManager.socketConnectingUserHandler",
        error
      );
    }
  };

  async addUserById(id: mongoose.Types.ObjectId) {
    try {
      if (this.users.has(id.toString())) {
        return this.users.get(id.toString());
      }
      const user = await User.findById(id);
      if (!user) {
        logger.error(`userManager couldn't add user with id ${id} to users.`);
        return null;
      }

      initRuntimePropsForAgent(user);
      this.users.set(user._id.toString(), user);
      return user;
    } catch (error: unknown) {
      catchErrorHandlerForFunction(`UserManager.addUserById`, error);
    }
  }

  async getUserByUsername(username: string) {
    try {
      for (let user of this.users.values()) {
        if (user.username === username.toLowerCase()) {
          return user;
        }
      }
      logger.warn(`No user in userManager.users by the name ${username}.`);
      return null;
    } catch (error: unknown) {
      catchErrorHandlerForFunction(`UserManager.getUserByUsername`, error);
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
    } catch (error: unknown) {
      catchErrorHandlerForFunction(`UserManager.removeUserById`, error);
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
