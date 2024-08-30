// parseCommand
import { commandsWith1Param, commandsWith2Params } from "../constants/validCommandWords.js";
  
export interface IParsedCommand {
    commandWord : string;
    directObject? : string;
    indirectObject? : string;
    string?: string;
}

function parseCommand (command: string) {
    const parsedCommand : IParsedCommand = {
        commandWord : ``,
    };
    const splitCommand = command.split(" ");
    parsedCommand.commandWord = splitCommand[0];
    if (commandsWith1Param.find(word => word === parsedCommand.commandWord)) {
        parsedCommand.directObject = splitCommand[1];
        if (splitCommand.length > 2) {
            parsedCommand.string = splitCommand.slice(2).join(" ");
            }
    } else if (commandsWith2Params.find(word => word === parsedCommand.commandWord)) {
        parsedCommand.directObject = splitCommand[1];
        parsedCommand.indirectObject = splitCommand[2];
        if (splitCommand.length > 3) {
            parsedCommand.string = splitCommand.slice(3).join(" ");
            }
    } else {
        parsedCommand.string = splitCommand.slice(1).join(" ");
    }
    return parsedCommand;
};

export default parseCommand;