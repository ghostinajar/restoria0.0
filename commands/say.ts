// say
// allows user to say someting to the room
import logger from "../logger.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import makeMessage from "../util/makeMessage.js";
import { IParsedCommand } from "../util/parseCommand.js";
import { IUser } from "../model/classes/User.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";

function say(parsedCommand: IParsedCommand, user: IUser) {
  try {
    let message = makeMessage("say", ``);

    if (!parsedCommand.string) {
      message.content = `Say what?`;
      worldEmitter.emit(`messageFor${user.username}`, message);
      return;
    }

    message.content = `You say, "${parsedCommand.string}".`;
    worldEmitter.emit(`messageFor${user.username}`, message);
    message.content = `${user.name} says, "${parsedCommand.string}".`;
    worldEmitter.emit(`messageFor${user.username}sRoom`, message);
    logger.log(
      `comms`,
      `${user._id} ${user.name} said, "${parsedCommand.string}".`
    );
  } catch (error: unknown) {
    catchErrorHandlerForFunction("say", error, user.name);
  }
}

export default say;
