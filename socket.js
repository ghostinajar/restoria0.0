import logger from "./logger.js";

const setupSocket = (io, world) => {
    io.on('connection', async (socket) => {
      try {
        // Check if the user is authenticated
        if (!socket.request.session.passport || !socket.request.session.passport.user) {
          socket.disconnect();
          return;
        }

        // Get the username and _id from the session and log it
        // NB: session only knows username and id, not User object
        const sessionUser = socket.request.session.passport.user;  
        logger.info(`User socket connected: ${sessionUser.username}, id: ${sessionUser._id}`);
        //TODO alert userManager to add user to users map, and return user object
        try {
          const user = await world.userManager.addUserById(sessionUser._id);
          logger.info(`Got user: ${user.username}`)
        } catch(err) {logger.error(err);};
        
      } catch(err) {
        logger.error(err);
      };

        // Listen for user commands
      socket.on('user command', (userInput) => {
        /*TODO in a separate module: sanitize, parse, validate the command. 
        Process with game logic and emit server response to relevant sockets/rooms*/
        logger.input(`User command: ${userInput}`);
        io.emit('say', JSON.stringify(userInput));
      });

      socket.on('disconnect', () => {
        try {
        logger.info(`User disconnected: ${socket.request.session.passport.user.username}`);
        } catch(err) {logger.error(err)};
      });
    });
  };
  
  export default setupSocket;
  