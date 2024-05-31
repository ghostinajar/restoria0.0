function say(parsedCommand, user) {
    const response = {
        toUser : `You say, "${parsedCommand.string}"`,
        toBroadcast : `${user.displayName} says, "${parsedCommand.string}"` 
    };
    return response;
}

export default say;