import isValidCommandWord from "./commands/isValidCommandWord.js";
import logger from "./logger.js";

const setupSocket = (io) => {
    io.on('connection', (socket) => {
      // Check if the user is authenticated
      if (!socket.request.session.passport || !socket.request.session.passport.user) {
        socket.disconnect();
        return;
      }
      // Get the user from the session and log it
      const user = socket.request.session.passport.user;
      logger.info(`User connected: ${user.username}`);

      // Listen for user commands
      socket.on('user command', (parsedCommand) => {
        // report/return invalid command
        if (!isValidCommandWord(parsedCommand.commandWord)) {
          socket.emit('invalid', 'Server rejected your command.');
          return;
        }

        logger.info(`User command: ${JSON.stringify(parsedCommand)}`);
        /*TODO in a separate module, process the command and emit server response to relevant sockets/rooms
        for now, just broadcast the command. E.g. 'say' commands will construct a string using the speaker 
        and what they said*/
        io.emit(parsedCommand.commandWord, parsedCommand);
      });

      socket.on('disconnect', () => {
        logger.info(`User disconnected: ${user.username}`);
      });
    });
  };
  
  export default setupSocket;
  