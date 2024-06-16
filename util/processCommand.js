import logger from "../logger.js";
import look from "../commands/look.js";
import quit from "../commands/quit.js";
import say from "../commands/say.js";
import shout from "../commands/shout.js";
import telepath from "../commands/telepath.js";
import who from "../commands/who.js";
async function processCommand(parsedCommand, user) {
    logger.debug(`Processing command: ${JSON.stringify(parsedCommand)}`);
    switch (parsedCommand.commandWord) {
        case `exa`:
        case `examine`:
        case `look`: {
            look(parsedCommand, user);
            break;
        }
        case `quit`: {
            quit(user);
            break;
        }
        case `say`: {
            say(parsedCommand, user);
            break;
        }
        case `shout`: {
            shout(parsedCommand, user);
            break;
        }
        case `t`:
        case `tel`:
        case `telepath`:
        case `tell`: {
            telepath(parsedCommand, user);
            break;
        }
        case `who`: {
            who(user);
            break;
        }
        default:
            {
                logger.error(`processCommand couldn't process a valid command: ${parsedCommand.commandWord}`);
            }
            ;
    }
}
export default processCommand;
