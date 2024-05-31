import logger from "./logger.js";
import worldEmitter from "./model/classes/WorldEmitter.js";
import validator from "validator";
import parseCommand from "./commands/parseCommand.js";
import isValidCommandWord from "./commands/isValidCommandWord.js";
import processCommand from "./commands/processCommand.js";

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
      const isMultiplaying = await new Promise((resolve) => {
        worldEmitter.once('userManagerCheckedMultiplay', resolve);
        worldEmitter.emit('socketCheckingMultiplay', sessionUser._id);
      });
    
      if (isMultiplaying) {
        logger.warn(`Username ${sessionUser.username} connected on more than one socket. Disconnecting.`);
        socket.emit('redirectToLogin');
        socket.disconnect();
        return;
      };

      // Add user to userManager, attach to socket
      const user = await new Promise((resolve) => {
        worldEmitter.once('userManagerAddedUser', resolve);
        worldEmitter.emit('socketConnectingUser', sessionUser._id);
      });
      socket.user = user;
      socket.character = null;

      // Listen for userSentCommands
      socket.on('userSentCommand', async (userInput) => {
        logger.input(`${socket.user.username} sent command: ${userInput}`);
        let sanitizedInput = validator.escape(userInput);
        let parsedInput = parseCommand(sanitizedInput);
        if (!isValidCommandWord(parsedInput.commandWord)) {
          //TODO If invalid command word log IP (suspicious because client should prevent this)
          socket.emit('redirectToLogin', `Server rejected command.`)
        }
        //Process with game logic and emit commandResponse to relevant sockets/rooms
        const commandResponse = await processCommand(parsedInput, user);
        //TODO emit and/or broadcast to appropriate ioRooms
        io.emit('serverSendingCommandResponse', JSON.stringify(commandResponse));
      });

      socket.on('userSubmittedNewCharacter', async (character) => {
          const commandResponse = await user.createCharacter(character);
          if (typeof commandResponse == 'string') {
            socket.emit('serverSendingCommandResponse', commandResponse);
          } else {
            socket.emit('serverSendingCommandResponse', `Character ${character.displayName} the ${character.job} created! That's number ${user.characters.length}.`)
          }
      });

      socket.on('disconnect', () => {
        try {
        logger.info(`User disconnected: ${user.name}`);
        //zoneManager listening for:
        worldEmitter.emit('socketDisconnectedUser', user);
        } catch(err) {logger.error(err)};
      });

    })
  } catch(err) {throw err};
};
  
export default setupSocket;