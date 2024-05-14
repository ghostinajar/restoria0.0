import isValidCommandWord from "./isValidCommandWord.js";
//TODO write anatomy of a command (e.g. commandWord, String, what else?)
//return an object with the command word and the rest of the string
function commandParser (command) {
    const parsedCommand = {}
    parsedCommand.commandWord = command.split(" ")[0];
    if (!isValidCommandWord(parsedCommand.commandWord)) {
        return 'invalid command';
    };
    switch (parsedCommand.commandWord) {
        case 'say':
            parsedCommand.string = command.split(" ").slice(1).join(" ");
            break;
        default:
            parsedCommand.string = command.split(" ").slice(1).join(" ");
            break;
    };
    return parsedCommand;
};

//export the function
export { commandParser };