import logger from "./logger.js";
import worldEmitter from "./model/classes/WorldEmitter.js";

const setupSocket = (io) => {
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
      
      //check for duplicate user
      const isMultiplay = await new Promise((resolve) => {
        worldEmitter.once('multiplayCheck', resolve);
        worldEmitter.emit('checkMultiplay', sessionUser._id);
      });
    
      if (isMultiplay) {
        logger.warn(`Username ${sessionUser.username} connected on more than one socket. Disconnecting.`);
        socket.emit('redirect-to-login');
        socket.disconnect();
        return;
      };

      // Add user to userManager, attach to socket
      const user = await new Promise((resolve) => {
        worldEmitter.once('userLogin', resolve);
        worldEmitter.emit('loginUser', sessionUser._id);
      });
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
        logger.info(`User disconnected: ${user.name}`);
        //zoneManager listening for:
        worldEmitter.emit('userDisconnected', user);
        } catch(err) {logger.error(err)};
      });

    })
  } catch(err) {throw err};
};
  
export default setupSocket;