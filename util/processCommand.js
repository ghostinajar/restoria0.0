import logger from "../logger.js";
import say from "../commands/say.js";
import shout from "../commands/shout.js";
import telepath from "../commands/telepath.js";
import who from "../commands/who.js";
async function processCommand(parsedCommand, user) {
    logger.debug(`Processing command: ${JSON.stringify(parsedCommand)}`);
    switch (parsedCommand.commandWord) {
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
                logger.error(`Command couldn't be processed.`);
            }
            ;
    }
}
export default processCommand;
