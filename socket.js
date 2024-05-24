import logger from "./logger.js";

const setupSocket = (io, world) => {
  try {  
    io.on('connection', async (socket) => {
        
      // Check for authenticated
      if (!socket.request.session.passport || !socket.request.session.passport.user) {
        socket.disconnect();
        return;
      }

      // Log username and _id on session (NB: not User object)
      const sessionUser = socket.request.session.passport.user;  
      logger.info(`User socket connected: ${sessionUser.username}, id: ${sessionUser._id}`);
      
      // Check for duplicate user, disconnect duplicate socket and tell client to redirect to /login
      if (world.userManager.users.has(sessionUser._id)) {
        logger.warn(`Username ${sessionUser.username} connected on more than one socket. Disconnecting.`);
        socket.emit('redirect-to-login');
        socket.disconnect();
        return;
      };

      // Add user to userManager, attach to socket
      const user = await world.userManager.addUserById(sessionUser._id);
      //logger.info(`userManager.users = ${JSON.stringify(Array.from(world.userManager.users))}`)
      socket.user = user;

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

    })
  } catch(err) {throw err};
};
  
export default setupSocket;