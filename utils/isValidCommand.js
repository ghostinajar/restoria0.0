const validCommands = ["say"];

function isValidCommand (string) {
    //validate first word
    const command = string.split(" ")[0];
    if (!validCommands.includes(command.toLowerCase())) {
        console.log(`User entered invalid command: ${command}`);
        return false;
    }
    return true;
};

export default isValidCommand;