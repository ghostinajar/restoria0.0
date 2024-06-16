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
import mongoose from "mongoose";

async function processCommand(parsedCommand: IParsedCommand, user: IUser & mongoose.Document) {
    logger.debug(`Processing command: ${JSON.stringify(parsedCommand)}`)
    switch (parsedCommand.commandWord) {
        case `ex`:
        case `exit`:
        case `exits`: {
            exits(parsedCommand, user);
            break;
        }
        case `exa`:
        case `examine`:
        case `look` : {
            look(parsedCommand, user);
            break;
        }
        case `quit` : {
            quit(user);
            break;
        }
        case `say` : {
            say(parsedCommand, user);
            break;
        }
        case `shout` : {
            shout(parsedCommand, user);
            break;
        }
        case `t` :
        case `tel` :
        case `telepath` :
        case `tell` : {
            telepath(parsedCommand, user);
            break;
        }
        case `who` : {
            who(user);
            break;
        }
        default : {logger.error(`processCommand couldn't process a valid command: ${parsedCommand.commandWord}`)};
    }
}

export default processCommand;