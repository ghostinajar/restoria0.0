// parseCommand
// processes a full user input string into components in an object
// e.g. {commandWord, directObject?, indirectObject?, string?}
import { commandsWith1Param, commandsWith2Params, } from "../constants/validCommandWords.js";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
function parseCommand(command) {
    try {
        const parsedCommand = {
            commandWord: ``,
        };
        const splitCommand = command.split(" ");
        parsedCommand.commandWord = splitCommand[0];
        if (commandsWith1Param.find((word) => word === parsedCommand.commandWord)) {
            parsedCommand.directObject = splitCommand[1];
            if (splitCommand.length > 2) {
                parsedCommand.string = splitCommand.slice(2).join(" ");
            }
        }
        else if (commandsWith2Params.find((word) => word === parsedCommand.commandWord)) {
            parsedCommand.directObject = splitCommand[1];
            parsedCommand.indirectObject = splitCommand[2];
            if (splitCommand.length > 3) {
                parsedCommand.string = splitCommand.slice(3).join(" ");
            }
        }
        else {
            parsedCommand.string = splitCommand.slice(1).join(" ");
        }
        return parsedCommand;
    }
    catch (error) {
        catchErrorHandlerForFunction(`parseCommand`, error);
        return { commandWord: 'command-parsing-error' };
    }
}
export default parseCommand;
