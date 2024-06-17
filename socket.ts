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
import mongoose from "mongoose";
import look from "./commands/look.js";
import authenticateSessionUserOnSocket from "./util/authenticateSessionUserOnSocket.js";
import disconnectMultiplayerOnSocket from "./util/disconnectMultiplayerOnSocket.js";
import setupUserOnSocket from "./util/setupUserOnSocket.js";
import userSentCommandHandler from "./util/userSentCommandHandler.js";
import getRoomOfUser from "./util/getRoomOfUser.js";

const setupSocket = (io: any) => {
  let connectedSockets : any = [];

  try {
    io.on(`connection`, async (socket: any) => {
      connectedSockets.push(socket);
      console.log(`${connectedSockets.count} connectedSockets:` + connectedSockets);

      authenticateSessionUserOnSocket(socket);
      if (!authenticateSessionUserOnSocket(socket)) {
        return;
      }
      if (await disconnectMultiplayerOnSocket(socket)) {
        return;
      }
      const user: (IUser & mongoose.Document) | undefined =
        await setupUserOnSocket(socket);
      if (!user) {
        socket.disconnect;
        return;
      }

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
          let room = await getRoomOfUser(user);
          logger.debug(`users in room ${room.users.map(user => user.name)}`);
          let message = makeMessage("quit", `${user.name} left Restoria.`);
          worldEmitter.emit(`messageFor${user.username}sRoom`, message);
          logger.info(`User socket disconnected: ${user.name}`);
          // Alert zoneManager, which will remove user from their location's room.users array
          // Then, zonemanager will alert userManager to remove user from users map
          worldEmitter.emit(`socketDisconnectedUser`, user);
        } catch (err) {
          logger.error(err);
        }
        connectedSockets = connectedSockets.filter((s : any) => s !== socket);
        console.log(`connectedSockets:` + connectedSockets);
      });
    });
  } catch (err) {
    throw err;
  }
};

export default setupSocket;
