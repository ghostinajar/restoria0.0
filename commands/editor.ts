// editor
// allows user to change the person who has access to edit their zones

import logger from "../logger.js";
import User, { IUser } from "../model/classes/User.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import makeMessage from "../util/makeMessage.js";
import { IParsedCommand } from "../util/parseCommand.js";

async function editor(parsedCommand: IParsedCommand, user: IUser) {
  try {
    let editorHelpArray = [];
    editorHelpArray.push(
      makeMessage(
        "help",
        "Your editor can make changes and suggestions in all your zones."
      )
    );
    editorHelpArray.push(
      makeMessage(
        "help",
        "Choose someone you trust, and make sure to back up all your writing."
      )
    );

    const target = parsedCommand.directObject;
    let editor = await User.findById(user.editor);

    if (!target) {
      if (editor) {
        editorHelpArray.push(
          makeMessage(
            `help`,
            `Your editor is ${editor.name}. To change it, provide a name, e.g. EDITOR RALU`
          )
        );
        worldEmitter.emit(`messageArrayFor${user.username}`, editorHelpArray);
        return;
      } else {
        editorHelpArray.push(
          makeMessage(
            "help",
            "Who would you like to be your editor? e.g. EDITOR RALU"
          )
        );
        worldEmitter.emit(`messageArrayFor${user.username}`, editorHelpArray);
        return;
      }
    }

    if (target.toLowerCase() === "none") {
      user.editor = null;
      await user.save();

      editorHelpArray.push(
        makeMessage(
          "success",
          `Editor removed. To choose someone, give their name, e.g. EDITOR RALU`
        )
      );
      worldEmitter.emit(`messageArrayFor${user.username}`, editorHelpArray);
      return;
    }

    let newEditor = await User.findOne({ username: target.toLowerCase() });

    if (!newEditor) {
      worldEmitter.emit(
        `messageFor${user.username}`,
        makeMessage("rejection", `There is no user named ${target}.`)
      );
      return;
    }

    user.editor = newEditor._id;
    await user.save();

    editorHelpArray.push(
      makeMessage("success", `Your new editor is ${newEditor.name}.`)
    );
    worldEmitter.emit(`messageArrayFor${user.username}`, editorHelpArray);
  } catch (error: unknown) {
    worldEmitter.emit(
      `messageFor${user.username}`,
      makeMessage(
        "rejection",
        `There was an error on our server. Ralu will have a look at it soon!`
      )
    );
    if (error instanceof Error) {
      logger.error(`"editor" function error for user ${user.username}: ${error.message}`);
    } else {
      logger.error(`"editor" function error for user ${user.username}: ${error}`);
    }
  }
}

export default editor;
