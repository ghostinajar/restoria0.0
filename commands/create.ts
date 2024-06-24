import { IUser } from "../model/classes/User.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import makeMessage from "../types/makeMessage.js";
import { IParsedCommand } from "../util/parseCommand.js";

async function create(parsedCommand: IParsedCommand, user: IUser) {
  let target = parsedCommand.directObject;
  if (!target) {
    worldEmitter.emit(
      `messageFor${user.username}`,
      makeMessage(`rejection`, `Create what?`)
    );
    return;
  }

  switch (target) {
    case `user`: {
      worldEmitter.emit(`formPromptFor${user.username}`, {
        form: `createUserForm`,
      });
      break;
    }
    default: {
      worldEmitter.emit(
        `messageFor${user.username}`,
        makeMessage(`rejection`, `Create what?`)
      );
      return;
    }
  }
}

export default create;
