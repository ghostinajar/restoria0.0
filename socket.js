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
      const isMultiplay = await new Promise((resolve) => {
        worldEmitter.once('userManagerCheckedMultiplay', resolve);
        worldEmitter.emit('socketCheckingMultiplay', sessionUser._id);
      });
    
      if (isMultiplay) {
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

      // Listen for userSentCommands
      socket.on('userSentCommand', (userInput) => {
        logger.input(`${socket.user.username} sent command: ${userInput}`);
        /*TODO sanitize, parse, validate the command. 
        If invalid command word, disconnect user, log IP (suspicious because client should prevent this)
        Process with game logic and emit commandResponse to relevant sockets/rooms*/
        let sanitizedInput = validator.escape(userInput);
        let parsedInput = parseCommand(sanitizedInput);
        if (!isValidCommandWord(parsedInput.commandWord)) {
          socket.emit('redirectToLogin', `Server rejected command.`)
        }
        const commandResponse = processCommand(parsedInput, user);
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