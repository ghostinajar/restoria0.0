import logger from "../logger.js";
import { IDescription } from "../model/classes/Description.js";
import { IUser } from "../model/classes/User.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import makeMessage from "../types/makeMessage.js";
import truncateDescription from "../util/truncateDescription.js";

async function editUser(user: IUser, userDescription: IDescription) {
  let changed = false;
  // logger.debug(
  //   `editUser received user ${user.name} request for userDescription: ${JSON.stringify(
  //     userDescription
  //   )}`
  // );
  if (!userDescription) {
    worldEmitter.emit(
      `messageFor${user.username}`,
      makeMessage(
        `rejected`,
        `Oops! The form didn't seem to have any new descriptions.`
      )
    );
    return;
  }
  truncateDescription(userDescription, user);
  if (userDescription !== user.description) {
    user.description = userDescription;
    changed = true;
  }
  // logger.debug(
  //   `editUser updated user ${user.name}'s description: ${JSON.stringify(
  //     user.description
  //   )}`
  // );

  if (changed) {
    user.history.modifiedDate = new Date();
    await user.save();
    worldEmitter.emit(
      `messageFor${user.username}`,
      makeMessage(
        `success`,
        `User description saved! Type 'examine ${user.name}' to view it.`
      )
    );
    return;
  } else {
    worldEmitter.emit(
      `messageFor${user.username}`,
      makeMessage(`rejected`, `No change saved to user description.`)
    );
    return;
  }
}

export default editUser;
