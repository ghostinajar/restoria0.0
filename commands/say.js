function say(parsedCommand, user) {
    const response = {
        emitToUser : `You say, "${parsedCommand.string}"`,
        broadcastToRoom : `${user.displayName} says, "${parsedCommand.string}"` 
    };
    return response;
}

export default say;