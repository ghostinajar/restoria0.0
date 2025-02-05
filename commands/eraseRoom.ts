// eraseRoom
// handles a user submitting erase_room form

import logger from "../logger.js";
import { IUser } from "../model/classes/User.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import getZoneOfUser from "../util/getZoneofUser.js";
import messageToUsername from "../util/messageToUsername.js";
import lookExamine from "./lookExamine.js";

async function eraseRoom(
  formData: {
    _id: string;
    name: string;
  },
  user: IUser
) {
  try {
    const zone = await getZoneOfUser(user);
    if (!zone) {
      throw new Error(`Couldn't get ${user.username}'s zone.`);
    }
    await zone.eraseRoomById(formData._id);
    logger.info(
      `User ${user.name} erased room ${formData.name}, id: ${formData._id}`
    );

    await lookExamine({ commandWord: "look" }, user);
    messageToUsername(
      user.username,
      `You permanently erased the room ${formData.name}.`,
      "success"
    );
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`eraseRoom`, error, user?.name);
  }
}

export default eraseRoom;
