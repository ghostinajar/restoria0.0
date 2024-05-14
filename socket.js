import { commandParser } from './commands/commandParser.js'; 

const setupSocket = (io) => {
    io.on('connection', (socket) => {
      // Check if the user is authenticated
      if (!socket.request.session.passport || !socket.request.session.passport.user) {
        socket.disconnect();
        return;
      }
      // Get the user from the session and log it
      const user = socket.request.session.passport.user;
      console.log(`User connected: ${user.username}`);

      // Listen for user commands
      socket.on('user command', (command) => {
        const parsedCommand = commandParser(command);
        // return if the command is invalid
        if (parsedCommand === 'invalid command') {
          socket.emit('invalid', parsedCommand);
          return;
        }
        console.log(`User command: ${JSON.stringify(parsedCommand)}`);
        io.emit(parsedCommand);
      });

      socket.on('disconnect', () => {
        console.log(`User disconnected: ${user.username}`);
      });
    });
  };
  
  export default setupSocket;
  