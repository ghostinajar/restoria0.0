// shout
// allows user to shout someting to the zone
import logger from "../logger.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import makeMessage from "../util/makeMessage.js";
import { IParsedCommand } from "../util/parseCommand.js";
import { IUser } from "../model/classes/User.js";

function shout(parsedCommand: IParsedCommand, user: IUser) {
  try {
    let message = makeMessage("shout", ``);

    if (!parsedCommand.string) {
      message.content = `Shout what?`;
      worldEmitter.emit(`messageFor${user.username}`, message);
      return;
    }

    message.content = `You shout, "${parsedCommand.string}".`;
    worldEmitter.emit(`messageFor${user.username}`, message);
    message.content = `${user.name} shouts, "${parsedCommand.string}".`;
    worldEmitter.emit(`messageFor${user.username}sZone`, message);
    logger.log(
      `comms`,
      `${user._id} ${user.name} shouted, "${parsedCommand.string}".`
    );
  } catch (error: unknown) {
    worldEmitter.emit(
      `messageFor${user.username}`,
      makeMessage(
        "rejection",
        `There was an error on our server. Ralu will have a look at it soon!`
      )
    );
    if (error instanceof Error) {
      logger.error(`shout error for user ${user.username}: ${error.message}`);
    } else {
      logger.error(`shout error for user ${user.username}: ${error}`);
    }
  }
}

export default shout;
