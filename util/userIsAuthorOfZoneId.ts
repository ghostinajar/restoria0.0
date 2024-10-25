// userIsAuthorOfZone

import { IUser } from "../model/classes/User.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import makeMessage from "../types/makeMessage.js";

function userIsAuthorOfZoneId(zoneId: string, user: IUser) {
  if (zoneId !== user._id.toString()) {
    worldEmitter.emit(
      `messageFor${user.username}`,
      makeMessage(`rejection`, `You aren't an author for this zone.`)
    );
    return false;
  }
  return true;
}

export default userIsAuthorOfZoneId;
