import logger from "./logger.js";
import worldEmitter from "./model/classes/WorldEmitter.js";
import validator from "validator";
import parseCommand from "./util/parseCommand.js";
import isValidCommandWord from "./util/isValidCommandWord.js";
import processCommand from "./util/processCommand.js";
import Name from "./model/classes/Name.js";

const setupSocket = (io) => {
  try {
    io.on('connection', async (socket) => {

      // Not authenticated? Disconnect.
      if (!socket.request.session.passport || !socket.request.session.passport.user) {
        socket.disconnect();
        return;
      }

      // Log username and _id on session (NB: not User object)
      const sessionUser = socket.request.session.passport.user;
      logger.info(`User socket connected: ${sessionUser.username}, id: ${sessionUser._id}`);

      // User multiplaying sockets? Disconnect.
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

      // Get user, alert userManager
      const user = await new Promise((resolve) => {
        worldEmitter.once('userManagerAddedUser', resolve);
        worldEmitter.emit('socketConnectingUser', sessionUser._id);
      });

      // Set authorState
      user.activeCharacter = null;
      user.characterState = false;

      // Add to location's ioRoom on login
      socket.join(user.location.inRoom.toString());
      socket.join(user.location.inZone.toString());

      const telepathHandler = async (string) => {
        //logger.debug(`${user.name}'s socket received event telepathTo${user.name}, containing "${string}" tried telapathHandler`);
        socket.emit('telepath', string);
      }
      worldEmitter.on(`telepathTo${user.name}`, telepathHandler);

      // Listen for userSentCommands
      socket.on('userSentCommand', async (userInput) => {
        logger.input(`${user.username} sent command: ${userInput}`);
        
        // Sanitize, parse,  validate command
        //let sanitizedInput = validator.escape(userInput);
        let parsedInput = parseCommand(userInput);
        if (!isValidCommandWord(parsedInput.commandWord)) {
          //TODO If invalid command word log IP (suspicious because client should prevent this)
          socket.emit('redirectToLogin', `Server rejected command.`)
        }

        //Process command and await response
        const commandResponse = await processCommand(parsedInput, user);

        //TODO emit and/or broadcast to appropriate ioRooms
        socket.emit('serverSendingCommandResponse', (commandResponse.emitToUser));
        if (commandResponse.broadcastToRoom) {
          socket.to(user.location.inRoom.toString())
            .emit('serverSendingCommandResponse', (commandResponse.broadcastToRoom));
        };
        if (commandResponse.broadcastToZone) {
          socket.to(user.location.inZone.toString())
            .emit('serverSendingCommandResponse', (commandResponse.broadcastToZone));
        }
      });

      socket.on('userSubmittedNewCharacter', async (character) => {
        logger.debug(`userSubmittedNewCharacter ${character.name}`);
        let nameIsTaken = await Name.findOne({ name: character.name.toLowerCase() });      
        if(nameIsTaken) {
            socket.emit('serverSendingCommandResponse', `That name is taken.`)
            return;
          }
          const commandResponse = await user.createCharacter(character);
          if (typeof commandResponse == 'string') {
            socket.emit('serverSendingCommandResponse', commandResponse);
          } else {
            socket.emit('serverSendingCommandResponse', `You created ${character.displayName} the ${character.job}! You have ${user.characters.length}/12 characters. Type 'character ${character.displayName}' to play your new character.`)
          }
      });

      socket.on('disconnect', () => {
        try {
        logger.info(`User disconnected: ${user.name}`);
        // Alert zoneManager
        worldEmitter.emit('socketDisconnectedUser', user);
        } catch(err) {logger.error(err)};
      });

    })
  } catch(err) {throw err};
};

export default setupSocket;