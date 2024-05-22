function parseCommand (command) {
    const parsedCommand = {};
    splitCommand = command.split(" ");
    parsedCommand.commandWord = splitCommand[0];
    if (splitCommand.length > 1) {
    parsedCommand.string = splitCommand.slice(1).join(" ");
    }
    return parsedCommand;
};

export default parseCommand;