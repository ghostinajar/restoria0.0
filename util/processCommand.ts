// processCommand
import logger from "../logger.js";
import exits from "../commands/exits.js";
import look from "../commands/look.js";
import quit from "../commands/quit.js";
import say from "../commands/say.js";
import shout from "../commands/shout.js";
import telepath from "../commands/telepath.js";
import who from "../commands/who.js";
import { IParsedCommand } from "./parseCommand.js";
import { IUser } from "../model/classes/User.js";
import stats from "../commands/stats.js";
import move from "../commands/move.js";
import edit from "../commands/edit.js";
import create from "../commands/create.js";
import erase from "../commands/erase.js";

async function processCommand(parsedCommand: IParsedCommand, user: IUser) {
  // logger.debug(`Processing command: ${JSON.stringify(parsedCommand)}`);
  switch (parsedCommand.commandWord) {
    case `create`: {
      await create(parsedCommand, user);
      break;
    }
    case `edit`: {
      await edit(parsedCommand, user);
      break;
    }
    case `delete`: // we can't make a delete() function, so it calls erase()
    case `erase`: {
      await erase(parsedCommand, user);
      break;
    }
    case `ex`:
    case `exit`:
    case `exits`: {
      await exits(user);
      break;
    }
    case `exa`:
    case `examine`:
    case `l`:
    case `look`: {
      await look(parsedCommand, user);
      break;
    }
    case `n`:
    case `north`:
    case `e`:
    case `east`:
    case `s`:
    case `south`:
    case `w`:
    case `west`:
    case `u`:
    case `up`:
    case `d`:
    case `down`: {
      await move(parsedCommand, user);
      break;
    }
    case `quit`: {
      await quit(user);
      break;
    }
    case `say`: {
      say(parsedCommand, user);
      break;
    }
    case `shout`: {
      await shout(parsedCommand, user);
      break;
    }
    case `stat`:
    case `stats`: {
      await stats(user);
      break;
    }
    case `t`:
    case `tel`:
    case `telepath`:
    case `tell`: {
      await telepath(parsedCommand, user);
      break;
    }
    case `who`: {
      await who(user);
      break;
    }
    default: {
      logger.error(
        `processCommand couldn't process a valid command: ${parsedCommand.commandWord}`
      );
    }
  }
}

export default processCommand;
