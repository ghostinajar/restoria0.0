import isValidCommandWord from "./commands/isValidCommandWord.js";
import parseCommand from "./commands/parseCommand.js";
import logger from "./logger.js";

const setupSocket = (io, world) => {
    io.on('connection', async (socket) => {
      // Check if the user is authenticated
      if (!socket.request.session.passport || !socket.request.session.passport.user) {
        socket.disconnect();
        return;
      }
      // Get the username and _id from the session and log it
      const sessionUser = socket.request.session.passport.user;  
      // NB: session only has username and id, not User object
      logger.info(`User socket connected: username on session: ${sessionUser.username}, id on session: ${sessionUser._id}`);
      // TODO alert UserManager to instantiate User object and add to userInstances map
      //const userInstance = await world.userManager.instantiateUserByUsername(user.username);
      //logger.info(`userInstance: ${JSON.stringify(userInstance)}`);

      // Listen for user commands
      socket.on('user command', (userInput) => {
        /*TODO in a separate module: sanitize, parse, validate the command. 
        Process with game logic and emit server response to relevant sockets/rooms*/
        logger.info(`User command: ${userInput}`);
        io.emit('say', JSON.stringify(userInput));
      });

      socket.on('disconnect', () => {
        logger.info(`User disconnected: ${user.username}`);
      });
    });
  };
  
  export default setupSocket;
  