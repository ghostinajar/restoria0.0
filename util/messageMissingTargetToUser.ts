// messageMissingTargetToUser

import { IUser } from "../model/classes/User.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import makeMessage from "./makeMessage.js";

function messageMissingTargetToUser(user: IUser, keyword: string) {
  worldEmitter.emit(
    `messageFor${user.username}`,
    makeMessage(`failure`, `You can't seem to find that ${keyword}.`)
  );
}

export default messageMissingTargetToUser;
