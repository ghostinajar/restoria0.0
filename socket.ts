// socket
import logger from "./logger.js";
import worldEmitter from "./model/classes/WorldEmitter.js";
import parseCommand, { IParsedCommand } from "./util/parseCommand.js";
import isValidCommandWord from "./util/isValidCommandWord.js";
import processCommand from "./util/processCommand.js";
import createUser, { IUserData } from "./commands/createUser.js";
import { IUser } from "./model/classes/User.js";
import IMessage from "./types/Message.js";
import makeMessage from "./types/makeMessage.js";

const authenticateSessionUser = (socket: any) => {
  try {
    // Not authenticated? Disconnect.
    if (
      !socket.request.session.passport ||
      !socket.request.session.passport.user
    ) {
      socket.emit(`redirectToLogin`);
      socket.disconnect();
      return;
    }

    // Log username and _id on session (NB: not User object)
    const sessionUser = socket.request.session.passport.user;
    logger.debug(
      `looked in socket.request.session.passport.user and found ${JSON.stringify(
        sessionUser
      )}`
    );
    logger.info(
      `User socket connected: ${sessionUser.name}, id: ${sessionUser._id}`
    );
    return sessionUser;
  } catch (err: any) {
    logger.error(`Error in authenticateSessionUser: ${err.message}`);
    throw err;
  }
};

const disconnectMultiplayer = async (socket: any, sessionUser: any) => {
  try {
    // User multiplaying sockets? Disconnect.
    const isMultiplaying = await new Promise((resolve) => {
      worldEmitter.once(`userManagerCheckedMultiplay`, resolve);
      worldEmitter.emit(`socketCheckingMultiplay`, sessionUser._id);
    });
    if (isMultiplaying) {
      logger.warn(
        `username ${sessionUser.name} connected on more than one socket. Disconnecting.`
      );
      socket.emit(`redirectToLogin`);
      socket.disconnect();
      return true;
    }
    return false;
  } catch (err: any) {
    logger.error(`Error in disconnectMultiplayer: ${err.message}`);
    throw err;
  }
};

const setupUser = async (sessionUser: any, socket: any) => {
  try {
    // Get user, alert userManager
    const user: IUser = await new Promise((resolve) => {
      worldEmitter.once(`userManagerAddedUser`, resolve);
      worldEmitter.emit(`socketConnectingUser`, sessionUser._id);
    });

    if (!user) {
      logger.error(`socket couldn't setupUser`);
      socket.emit(`redirectToLogin`);
      socket.disconnect();
      return;
    }

    // Add to location's ioRoom on login
    socket.join(user.location.inRoom.toString());
    socket.join(user.location.inZone.toString());

    return user;
  } catch (err: any) {
    logger.error(`Error in setupUser: ${err.message}`);
  }
};

const setupSocket = (io: any) => {
  try {
    io.on(`connection`, async (socket: any) => {
      const sessionUser = authenticateSessionUser(socket);
      if (!sessionUser) {
        return;
      }
      if (await disconnectMultiplayer(socket, sessionUser)) {
        return;
      }
      const user = await setupUser(sessionUser, socket);
      if (!user) {
        return;
      }

      const messageForUserHandler = async (messageObject: IMessage) => {
        socket.emit(`message`, messageObject);
      };
      worldEmitter.on(`messageFor${user.username}`, messageForUserHandler);

      const messageForUsersRoomHandler = async (messageObject: IMessage) => {
        socket
          .to(user.location.inRoom.toString())
          .emit(`message`, messageObject);
      };
      worldEmitter.on(
        `messageFor${user.username}sRoom`,
        messageForUsersRoomHandler
      );

      const messageForUsersZoneHandler = async (messageObject: IMessage) => {
        socket
          .to(user.location.inZone.toString())
          .emit(`message`, messageObject);
      };
      worldEmitter.on(
        `messageFor${user.username}sZone`,
        messageForUsersZoneHandler
      );

      // Listen for userSentCommands
      socket.on(`userSentCommand`, async (userInput: string) => {
        logger.input(`${user.name} sent command: ${userInput}`);

        // Sanitize, parse, validate command
        // TODO sanitize command
        let parsedInput = parseCommand(userInput);
        if (!isValidCommandWord(parsedInput.commandWord)) {
          //TODO If invalid command word log IP (suspicious because client should prevent this)
          socket.emit(`redirectToLogin`, `Server rejected command.`);
        }
        await processCommand(parsedInput, user);
      });

      socket.on(
        `userSubmittedNewCharacter`,
        async (characterData: IUserData) => {
          logger.debug(
            `userSubmittedNewCharacter heard by socket with ${characterData}`
          );
          const newUser = await createUser(characterData, user);
          if ("content" in newUser) {
            //createUser handles emit failure message to socket
            return;
          }
          let message = makeMessage(
            true,
            `createCharacter`,
            `You created a character named ${newUser.name}. You can sign out, then sign in as your new character.`
          );
          socket.emit(`createCharacter`, message);
        }
      );

      socket.on(`disconnect`, () => {
        try {
          logger.info(`User disconnected: ${user.name}`);
          // Alert zoneManager
          worldEmitter.emit(`socketDisconnectedUser`, user);
        } catch (err) {
          logger.error(err);
        }
      });
    });
  } catch (err) {
    throw err;
  }
};

export default setupSocket;
