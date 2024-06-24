import { IUser } from "../model/classes/User.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import makeMessage from "../types/makeMessage.js";
import { IParsedCommand } from "../util/parseCommand.js";

async function edit(parsedCommand: IParsedCommand, user: IUser) {
  let target = parsedCommand.directObject;
  if (!target) {
    worldEmitter.emit(
      `messageFor${user.username}`,
      makeMessage(`rejection`, `Edit what?`)
    );
    return;
  }

  switch (target) {
    default: {
      worldEmitter.emit(
        `messageFor${user.username}`,
        makeMessage(`rejection`, `Edit what?`)
      );
      return;
    }
  }
}

export default edit;
