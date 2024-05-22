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
        const sessionUser = socket.request.session.passport.user;  
        // NB: session only knows username and id, not User object
        logger.info(`User socket connected: ${sessionUser.username}, id: ${sessionUser._id}`);
        // TODO alert UserManager to instantiate User object and add to userInstances map
        //const userInstance = await world.userManager.instantiateUserByUsername(user.username);
        //logger.info(`userInstance: ${JSON.stringify(userInstance)}`);
      } catch(err) {
        logger.error("Couldn't grab the username/id from the session.", err);
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
  