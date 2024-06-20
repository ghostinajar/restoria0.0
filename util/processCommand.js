// processCommand
import logger from "../logger.js";
import exits from "../commands/exits.js";
import look from "../commands/look.js";
import quit from "../commands/quit.js";
import say from "../commands/say.js";
import shout from "../commands/shout.js";
import telepath from "../commands/telepath.js";
import who from "../commands/who.js";
import stats from "../commands/stats.js";
async function processCommand(parsedCommand, user) {
    logger.debug(`Processing command: ${JSON.stringify(parsedCommand)}`);
    switch (parsedCommand.commandWord) {
        case `ex`:
        case `exit`:
        case `exits`: {
            await exits(user);
            break;
        }
        case `exa`:
        case `examine`:
        case `look`: {
            await look(parsedCommand, user);
            break;
        }
        case `quit`: {
            await quit(user);
            break;
        }
        case `say`: {
            await say(parsedCommand, user);
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
        default:
            {
                logger.error(`processCommand couldn't process a valid command: ${parsedCommand.commandWord}`);
            }
            ;
    }
    if (parsedCommand.commandWord !== `stats`) {
        stats(user);
    }
}
export default processCommand;
