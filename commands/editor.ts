// editor
// allows user to change the person who has access to edit their zones
import User, { IUser } from "../model/classes/User.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import makeMessage from "../util/makeMessage.js";
import { IParsedCommand } from "../util/parseCommand.js";
import save from "./save.js";

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

    if (target === "none") {
      user.editor = null;
      await save(user);

      editorHelpArray.push(
        makeMessage(
          "success",
          `Editor removed. To choose someone, give their name, e.g. EDITOR RALU`
        )
      );
      worldEmitter.emit(`messageArrayFor${user.username}`, editorHelpArray);
      return;
    }

    let newEditor = await User.findOne({ username: target });

    if (!newEditor) {
      worldEmitter.emit(
        `messageFor${user.username}`,
        makeMessage("rejection", `There is no user named ${target}.`)
      );
      return;
    }

    user.editor = newEditor._id;
    await save(user);

    editorHelpArray.push(
      makeMessage("success", `Your new editor is ${newEditor.name}.`)
    );
    worldEmitter.emit(`messageArrayFor${user.username}`, editorHelpArray);
  } catch (error: unknown) {
    catchErrorHandlerForFunction("editor", error, user.name)
  }
}

export default editor;
