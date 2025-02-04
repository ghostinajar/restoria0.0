// autoExamine
// user can toggle to see examine description of rooms they enter

import { IUser } from "../model/classes/User.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import messageToUsername from "../util/messageToUsername.js";
import { IParsedCommand } from "../util/parseCommand.js";

function messageON(user: IUser) {
  messageToUsername(
    user.username,
    `Autoexamine ON: You'll see full (EXAMINE) descriptions, even when you LOOK.`,
    "success"
  );
}

function messageOFF(user: IUser) {
  messageToUsername(
    user.username,
    `Autoexamine OFF: Use LOOK for short descriptions, and EXAMINE for longer ones.`,
    "success"
  );
}

async function autoExamine(parsedCommand: IParsedCommand, user: IUser) {
  try {
    // set
    if (parsedCommand.directObject?.toLowerCase() === "on") {
      user.preferences.autoExamine = true;
    } else if (parsedCommand.directObject?.toLowerCase() === "off") {
      user.preferences.autoExamine = false;
    } else {
      // toggle user.autoExamine to its opposite
      user.preferences.autoExamine = !user.preferences.autoExamine;
    }

    // notify and save
    if (user.preferences.autoExamine) {
      messageON(user);
    } else {
      messageOFF(user);
    }
    user.save();
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`autoExamine`, error, user?.name);
  }
}

export default autoExamine;
