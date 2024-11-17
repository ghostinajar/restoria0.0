// userHasZoneAuthorId
import { IUser } from "../model/classes/User.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
import makeMessage from "./makeMessage.js";

function userHasZoneAuthorId(zoneAuthorId: string, user: IUser) {
  try {
    if (zoneAuthorId !== user._id.toString()) {
      worldEmitter.emit(
        `messageFor${user.username}`,
        makeMessage(`rejection`, `You aren't an author for this zone.`)
      );
      return false;
    }
    return true;
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`userHasZoneAuthorId`, error, user?.name);
    return false;
  }
}

export default userHasZoneAuthorId;
