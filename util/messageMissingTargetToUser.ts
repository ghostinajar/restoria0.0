// messageMissingTargetToUser

import { IUser } from "../model/classes/User.js";
import messageToUsername from "./messageToUsername.js";

function messageMissingTargetToUser(user: IUser, keyword: string) {
  messageToUsername(
    user.username,
    `You can't seem to find the ${keyword}.`,
    `rejection`,
    false
  );
}

export default messageMissingTargetToUser;
