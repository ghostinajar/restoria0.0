// save
// saves the user to the database

import { IUser } from "../model/classes/User.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import messageToUsername from "../util/messageToUsername.js";

const SAVE_COOLDOWN = 10000; // 10 seconds in milliseconds
const lastSaveTimes = new Map<string, number>();

async function save(user: IUser, silent: boolean = false) {
  try {
    const now = Date.now();
    const lastSaveTime = lastSaveTimes.get(user.username) || 0;

    if (now - lastSaveTime < SAVE_COOLDOWN) {
      const remainingTime = Math.ceil(
        (SAVE_COOLDOWN - (now - lastSaveTime)) / 1000
      );

      if (!silent) {
        messageToUsername(
          user.username,
          `Please wait ${remainingTime} seconds before using SAVE again.`,
          "warning",
          true
        );
      }

      return;
    }

    await user.save();
    lastSaveTimes.set(user.username, now);

    if (!silent) {
      messageToUsername(
        user.username,
        `Your user data has been saved.`,
        `success`,
        true
      );
    }
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`save`, error, user?.name);
  }
}

export default save;
