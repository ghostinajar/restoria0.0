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
          //logger.info(`Got user: ${user.username}`)
          logger.info(`userManager.users = ${JSON.stringify(Array.from(world.userManager.users))}`)
          socket.user = user;
          logger.info(`io attached user ${socket.user.username} to socket.`)
        } catch(err) {logger.error(err);};
        
      } catch(err) {
        logger.error(err);
      };

        // Listen for user commands
      socket.on('user command', (userInput) => {
        /*TODO in a separate module: sanitize, parse, validate the command. 
        If invalid command word, disconnect user, log IP (suspicious because client should prevent this)
        Process with game logic and emit server response to relevant sockets/rooms*/
        logger.input(`${socket.user.username} sent command: ${userInput}`);
        io.emit('say', JSON.stringify(userInput));
      });

      socket.on('disconnect', () => {
        try {
        logger.info(`User disconnected: ${socket.request.session.passport.user.username}`);
        world.userManager.removeUserById(socket.request.session.passport.user._id);
        } catch(err) {logger.error(err)};
      });
    });
  };
  
  export default setupSocket;
  