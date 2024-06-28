import { IDescription } from "../model/classes/Description.js";
import { IUser } from "../model/classes/User.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import makeMessage from "../types/makeMessage.js";

function truncateDescription(description: IDescription, user: IUser) {
  if (description.look && description.look.length > 80) {
    description.look = description.look.substring(0, 80);
    worldEmitter.emit(
      `messageFor${user.username}`,
      makeMessage(
        `rejection`,
        `Look descriptions should be 80 characters (1 lines) or less. Shortened to '${description.look}'.`
      )
    );
  }

  if (description.examine && description.examine.length > 240) {
    description.examine = description.examine.substring(0, 240);
    worldEmitter.emit(
      `messageFor${user.username}`,
      makeMessage(
        `rejection`,
        `Examine descriptions should be 240 characters (3 lines) or less. Shortened to '${description.examine}'.`
      )
    );
  }

  if (description.study && description.study.length > 640) {
    description.study = description.study.substring(0, 640);
    worldEmitter.emit(
      `messageFor${user.username}`,
      makeMessage(
        `rejection`,
        `Study descriptions should be 640 characters (8 lines) or less. Shortened to '${description.study}'.`
      )
    );
  }

  if (description.research && description.research.length > 1600) {
    description.research = description.research.substring(0, 1600);
    worldEmitter.emit(
      `messageFor${user.username}`,
      makeMessage(
        `rejection`,
        `Research descriptions should be 1600 characters (20 lines) or less. Shortened to '${description.research}'.`
      )
    );
  }
}

export default truncateDescription;