// bug
// saves user input from bug_form
import mongoose from "mongoose";
import logger from "../logger.js";
import Bug from "../model/classes/Bug.js";
import { IUser } from "../model/classes/User.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import getRoomOfUser from "../util/getRoomOfUser.js";
import getZoneOfUser from "../util/getZoneofUser.js";
import makeMessage from "../util/makeMessage.js";

async function bug(bugDescription: string, user: IUser) {
  try {
    let newBugData: any = {
      _id: new mongoose.Types.ObjectId(),
      author: user._id,
      date: new Date(),
      description: bugDescription,
      location: {
        inZone: await getZoneOfUser(user),
        inRoom: await getRoomOfUser(user),
      },
      isValid: false,
    };

    // create and save to db
    const newBug = new Bug(newBugData);
    if (!newBug) {
      logger.error(`"bug" function couldn't save new bug from user ${user.name}!`);
      worldEmitter.emit(
        `messageFor${user.username}`,
        makeMessage(
          "rejection",
          `There was an error on our server. Ralu will have a look at it soon!`
        )
      );
      return;
    }

    await newBug.save();
    logger.info(
      `Author "${user.name}" reported a bug: "${newBug.description}".`
    );
    worldEmitter.emit(
      `messageFor${user.username}`,
      makeMessage(
        "success",
        `Thank you for your bug report! Ralu will review it soon.`
      )
    );
  } catch (error: unknown) {
    catchErrorHandlerForFunction("bug", error, user.name);
  }
}

export default bug;
