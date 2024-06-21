// socket
import logger from "./logger.js";
import worldEmitter from "./model/classes/WorldEmitter.js";
import createUser, { IUserData } from "./commands/createUser.js";
import { IUser } from "./model/classes/User.js";
import IMessage from "./types/Message.js";
import makeMessage from "./types/makeMessage.js";
import look from "./commands/look.js";
import authenticateSessionUserOnSocket from "./util/authenticateSessionUserOnSocket.js";
import disconnectMultiplayerOnSocket from "./util/disconnectMultiplayerOnSocket.js";
import setupUserOnSocket from "./util/setupUserOnSocket.js";
import userSentCommandHandler from "./util/userSentCommandHandler.js";

const setupSocket = (io: any) => {
  try {
    io.on(`connection`, async (socket: any) => {
      authenticateSessionUserOnSocket(socket);
      if (!authenticateSessionUserOnSocket(socket)) {
        return;
      }
      if (await disconnectMultiplayerOnSocket(socket)) {
        return;
      }
      const user: IUser | undefined = await setupUserOnSocket(socket);
      if (!user) {
        socket.disconnect;
        return;
      }

      // Remove existing event listeners for the user before adding new ones
      worldEmitter.removeAllListeners(`messageArrayFor${user.username}`);
      worldEmitter.removeAllListeners(`messageFor${user.username}`);
      worldEmitter.removeAllListeners(`messageFor${user.username}sRoom`);
      worldEmitter.removeAllListeners(`messageFor${user.username}sZone`);
      worldEmitter.removeAllListeners(`user${user.username}LeavingGame`);
      worldEmitter.removeAllListeners(`userChangingRooms`);

      const messageArrayForUserHandler = async (
        messageArray: Array<IMessage>
      ) => {
        for (let message of messageArray) {
          socket.emit(`message`, message);
        }
      };
      worldEmitter.on(
        `messageArrayFor${user.username}`,
        messageArrayForUserHandler
      );

      const messageForUserHandler = async (message: IMessage) => {
        socket.emit(`message`, message);
      };
      worldEmitter.on(`messageFor${user.username}`, messageForUserHandler);

      const messageForUsersRoomHandler = async (message: IMessage) => {
        logger.debug(`socket says ${user.name}'s location is ${JSON.stringify(user.location)}`)
        socket.to(user.location.inRoom.toString()).emit(`message`, message);
      };
      worldEmitter.on(
        `messageFor${user.username}sRoom`,
        messageForUsersRoomHandler
      );

      const messageForUsersZoneHandler = async (message: IMessage) => {
        socket.to(user.location.inZone.toString()).emit(`message`, message);
      };
      worldEmitter.on(
        `messageFor${user.username}sZone`,
        messageForUsersZoneHandler
      );

      const userXLeavingGameHandler = async (user: IUser) => {
        logger.debug(
          `socket received user${user.name}LeavingGame event. Disconnecting.`
        );
        socket.emit(`redirectToLogin`, `User ${user.name} left the game.`);
        socket.disconnect;
      };
      worldEmitter.on(
        `user${user.username}LeavingGame`,
        userXLeavingGameHandler
      );

      const userXChangingRoomsHandler = (
        originRoomId: string,
        originZoneId: string,
        destinationRoomId: string,
        destinationZoneId: string
      ) => {
        logger.debug(
          `userChangingRoomsHandler called with ${originRoomId},${originZoneId},${destinationRoomId},${destinationZoneId}`
        );
        logger.debug(`${user.name}'s socket is in rooms: ${Array.from(socket.rooms)}`)
        socket.leave(originRoomId);
        socket.join(destinationRoomId);
        if (originZoneId !== destinationZoneId) {
          logger.debug(`userChangingRoomsHandler changing users's ioZone to ${destinationZoneId}`)
          socket.leave(originZoneId);
          socket.join(destinationZoneId);
        }
        logger.debug(`${user.name}'s socket is now in rooms: ${Array.from(socket.rooms)}`)
      };
      worldEmitter.on(`user${user.username}ChangingRooms`, userXChangingRoomsHandler);

      // Listen for userSentCommands
      socket.on(`userSentCommand`, async (userInput: string) => {
        userSentCommandHandler(socket, userInput, user);
      });

      socket.on(
        `userSubmittedNewCharacter`,
        async (characterData: IUserData) => {
          const newUser = await createUser(characterData, user);
        }
      );

      let userArrivedMessage = makeMessage(
        `userArrived`,
        `${user.name} entered Restoria.`
      );
      worldEmitter.emit(`messageFor${user.username}sRoom`, userArrivedMessage);
      look({ commandWord: `look` }, user);

      socket.on(`disconnect`, async () => {
        try {
          let message = makeMessage("quit", `${user.name} left Restoria.`);
          worldEmitter.emit(`messageFor${user.username}sRoom`, message);
          logger.info(`User socket disconnected: ${user.name}`);
          // Alert zoneManager, which will remove user from their location's room.users array
          // Then, zonemanager will alert userManager to remove user from users map
          worldEmitter.emit(`socketDisconnectedUser`, user);
          // Remove existing event listeners for user
          worldEmitter.removeAllListeners(`messageArrayFor${user.username}`);
          worldEmitter.removeAllListeners(`messageFor${user.username}`);
          worldEmitter.removeAllListeners(`messageFor${user.username}sRoom`);
          worldEmitter.removeAllListeners(`messageFor${user.username}sZone`);
          worldEmitter.removeAllListeners(`user${user.username}LeavingGame`);
          worldEmitter.removeAllListeners(`userChangingRooms`);
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
