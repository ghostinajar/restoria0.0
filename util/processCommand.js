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
import move from "../commands/move.js";
import edit from "../commands/edit.js";
import create from "../commands/create.js";
import erase from "../commands/erase.js";
import recall from "../commands/recall.js";
import goto from "../commands/goto.js";
import suggest from "../commands/suggest.js";
import suggestions from "../commands/suggestions.js";
import editor from "../commands/editor.js";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
import help from "../commands/help.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import bugs from "../commands/bugs.js";
import updates from "../commands/updates.js";
import studyresearch from "../commands/studyresearch.js";
import map from "../commands/map.js";
import password from "../commands/password.js";
import sudobugs from "../commands/sudobugs.js";
async function processCommand(parsedCommand, user) {
    try {
        switch (parsedCommand.commandWord) {
            case `bug`: {
                help({
                    commandWord: "help",
                    directObject: "bug",
                }, user);
                worldEmitter.emit(`formPromptFor${user.username}`, {
                    form: `bugForm`,
                });
                break;
            }
            case `bugs`: {
                await bugs(user);
                break;
            }
            case `create`: {
                await create(parsedCommand, user);
                break;
            }
            case `edit`: {
                await edit(parsedCommand, user);
                break;
            }
            case `editor`: {
                await editor(parsedCommand, user);
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
                await map(user);
                break;
            }
            case `exa`:
            case `examine`:
            case `l`:
            case `look`: {
                await look(parsedCommand, user);
                await map(user);
                break;
            }
            case `goto`: {
                await goto(user);
                break;
            }
            case `help`: {
                help(parsedCommand, user);
                break;
            }
            case `map`: {
                await map(user);
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
                await map(user);
                break;
            }
            case `password`: {
                await password(parsedCommand, user);
                break;
            }
            case `quit`: {
                await quit(user);
                break;
            }
            case `recall`: {
                await recall(user);
                await map(user);
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
            case `stat`:
            case `stats`: {
                stats(user);
                break;
            }
            case `study`:
            case `sudobugs`: {
                await sudobugs(parsedCommand, user);
                break;
            }
            case `research`: {
                studyresearch(parsedCommand, user);
                break;
            }
            case `suggest`: {
                await suggest(parsedCommand, user);
                break;
            }
            case `suggestions`: {
                await suggestions(user);
                break;
            }
            case `t`:
            case `tel`:
            case `telepath`:
            case `tell`: {
                await telepath(parsedCommand, user);
                break;
            }
            case `updates`: {
                await updates(parsedCommand, user);
                break;
            }
            case `who`: {
                await who(user);
                break;
            }
            default: {
                logger.error(`processCommand couldn't process a valid command: ${parsedCommand.commandWord}`);
            }
        }
    }
    catch (error) {
        catchErrorHandlerForFunction(`processCommand`, error, user?.name);
    }
}
export default processCommand;
