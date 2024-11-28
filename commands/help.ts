// help
// shows the user information about a game command or concept
import HELP from "../constants/HELP.js";
import { IUser } from "../model/classes/User.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import IMessage from "../types/Message.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import htmlTableOfContentsForKeysOfObject from "../util/htmlTableOfContentsForKeysOfObject.js";
import makeMessage from "../util/makeMessage.js";
import { IParsedCommand } from "../util/parseCommand.js";

function help(parsedCommand: IParsedCommand, user: IUser) {
  try {
    if (!parsedCommand.directObject) {
      const helpContents = htmlTableOfContentsForKeysOfObject(HELP);
      worldEmitter.emit(
        `safeMessageFor${user.username}`,
        makeMessage(`help`, helpContents)
      );
      worldEmitter.emit(
        `safeMessageFor${user.username}`,
        makeMessage(`help`, `What would you like help with? E.g. HELP CREATE`)
      );
      return;
    }

    let target = parsedCommand.directObject;

    if (parsedCommand.string) {
      target = `${parsedCommand.directObject} ${parsedCommand.string}`;
    }

    target = target.replace(/ /g, "_");

    switch (target.toLowerCase()) {
      case `aggressive`:
        target = `aggressive_mob`;
        break;
      case `character`:
      case `user`:
        target = `author`;
        break;
      case `capacity`:
        target = `container`;
        break;
      case `look`:
      case `examine`:
      case `study`:
      case `research`:
        target = `description`;
        break;
      case `delete`:
      case `erase item`:
      case `delete item`:
      case `erase mob`:
      case `delete mob`:
      case `erase room`:
      case `delete room`:
        target = `erase`;
        break;
      case `ex`:
      case `edit_room_exits`:
        target = `exits`;
        break;
      case `hidden_item`:
      case `hidden_user`:
      case `hidden_mob`:
      case `hidden_exit`:
        target = `hidden`;
        break;
      case `item_spell`:
        target = `item_spell_properties`;
        break;
      case `armor`:
      case `potion`:
      case `scroll`:
      case `token`:
      case `treasure`:
      case `wand`:
      case `weapon`:
      case `fishing_rod`:
        target = `item_type`;
        break;
      case `fixture`:
      case `food`:
      case `lamp`:
      case `temporary`:
        target = `item_tag`;
        break;
      case `hp`:
      case `health`:
      case `mp`:
      case `mana`:
      case `magic`:
      case `mv`:
      case `movement`:
      case `str`:
      case `strength`:
      case `dex`:
      case `dexterity`:
      case `con`:
      case `constitution`:
      case `int`:
      case `intelligence`:
      case `wis`:
      case `wisdom`:
      case `spi`:
      case `spirit`:
        target = `stats`;
        break;
      default:
        break;
    }

    if (!HELP.hasOwnProperty(target.toUpperCase())) {
      target = target.replace(/_/g, " ");
      worldEmitter.emit(
        `messageFor${user.username}`,
        makeMessage(
          `rejection`,
          `Sorry, there's no help available yet for ${target}.`
        )
      );
      return;
    }

    let stringArray = HELP[target.toUpperCase()];
    let helpArray: Array<IMessage> = [];

    stringArray.forEach((string) => {
      helpArray.push(makeMessage("help", string));
    });

    worldEmitter.emit(`safeMessageArrayFor${user.username}`, helpArray);
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`help`, error, user?.name);
  }
}

export default help;
