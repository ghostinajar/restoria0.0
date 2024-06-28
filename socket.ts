// socket
import logger from "./logger.js";
import worldEmitter from "./model/classes/WorldEmitter.js";
import createRoom, { IRoomData } from "./commands/createRoom.js";
import createUser, { IUserData } from "./commands/createUser.js";
import { IUser } from "./model/classes/User.js";
import IMessage from "./types/Message.js";
import makeMessage from "./types/makeMessage.js";
import look from "./commands/look.js";
import authenticateSessionUserOnSocket from "./util/authenticateSessionUserOnSocket.js";
import disconnectMultiplayerOnSocket from "./util/disconnectMultiplayerOnSocket.js";
import setupUserOnSocket from "./util/setupUserOnSocket.js";
import userSentCommandHandler from "./util/userSentCommandHandler.js";
import { IDescription } from "./model/classes/Description.js";
import editUser from "./commands/editUser.js";
import {
  formPromptForUserHandler,
  messageArrayForUserHandler,
  messageForUserHandler,
  messageForUsersRoomHandler,
  messageForUsersZoneHandler,
  userXChangingRoomsHandler,
  userXLeavingGameHandler,
} from "./socketHandlers.js";
import stats from "./commands/stats.js";
import editRoom from "./commands/editRoom.js";
import getRoomOfUser from "./util/getRoomOfUser.js";
import createMobBlueprint, { IMobBlueprintData } from "./commands/createMobBlueprint.js";

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
      worldEmitter.removeAllListeners(`formPromptFor${user.username}`);
      worldEmitter.removeAllListeners(`messageArrayFor${user.username}`);
      worldEmitter.removeAllListeners(`messageFor${user.username}`);
      worldEmitter.removeAllListeners(`messageFor${user.username}sRoom`);
      worldEmitter.removeAllListeners(`messageFor${user.username}sZone`);
      worldEmitter.removeAllListeners(`user${user.username}LeavingGame`);
      worldEmitter.removeAllListeners(`user${user.username}ChangingRooms`);

      // Listen for game events
      worldEmitter.on(
        `formPromptFor${user.username}`,
        async (formData : any) => {
          formPromptForUserHandler(formData, socket);
        }
      )
      worldEmitter.on(
        `messageArrayFor${user.username}`,
        async (messageArray: Array<IMessage>) => {
          messageArrayForUserHandler(messageArray, socket);
        }
      );

      worldEmitter.on(
        `messageFor${user.username}`,
        async (message: IMessage) => {
          messageForUserHandler(message, socket);
        }
      );

      worldEmitter.on(
        `messageFor${user.username}sRoom`,
        async (message: IMessage) => {
          messageForUsersRoomHandler(message, socket, user);
        }
      );

      worldEmitter.on(
        `messageFor${user.username}sZone`,
        async (message: IMessage) => {
          messageForUsersZoneHandler(message, socket, user);
        }
      );

      worldEmitter.on(
        `user${user.username}LeavingGame`,
        async (user: IUser) => {
          userXLeavingGameHandler(user, socket);
        }
      );

      worldEmitter.on(
        `user${user.username}ChangingRooms`,
        async (
          originRoomId: string,
          originZoneId: string,
          destinationRoomId: string,
          destinationZoneId: string
        ) => {
          userXChangingRoomsHandler(
            originRoomId,
            originZoneId,
            destinationRoomId,
            destinationZoneId,
            socket,
            user
          );
        }
      );

      // Listen for client events
      socket.on(`userSentCommand`, async (userInput: string) => {
        userSentCommandHandler(socket, userInput, user);
      });

      socket.on(`userSubmittedNewMobBlueprint`, async (mobBlueprintData: IMobBlueprintData) => {
        const newMobBlueprint = await createMobBlueprint(mobBlueprintData, user);
      });

      socket.on(`userSubmittedNewRoom`, async (roomData: IRoomData) => {
        const newRoom = await createRoom(roomData, user);
      });

      socket.on(`userSubmittedNewUser`, async (userData: IUserData) => {
        const newUser = await createUser(userData, user);
      });

      socket.on(
        `userSubmittedUserDescription`,
        async (userDescription: IDescription) => {
          await editUser(user, userDescription);
        }
      );

      socket.on(
        `userSubmittedRoomEdit`,
        async (roomData: IRoomData) => {
          const room = await getRoomOfUser(user);
          await editRoom(room, roomData, user);
        }
      );

      // On connection, alert room and look
      let userArrivedMessage = makeMessage(
        `userArrived`,
        `${user.name} entered Restoria.`
      );
      worldEmitter.emit(`messageFor${user.username}sRoom`, userArrivedMessage);
      await look({ commandWord: `look` }, user);
      stats(user);

      socket.on(`disconnect`, async () => {
        try {
          let message = makeMessage("quit", `${user.name} left Restoria.`);
          worldEmitter.emit(`messageFor${user.username}sRoom`, message);
          logger.info(`User socket disconnected: ${user.name}`);
          // Alert zoneManager, which will remove user from their location's room.users array
          // Then, zonemanager will alert userManager to remove user from users map
          worldEmitter.emit(`socketDisconnectedUser`, user);
          // Remove existing event listeners for user
          worldEmitter.removeAllListeners(`formPromptFor${user.username}`);
          worldEmitter.removeAllListeners(`messageArrayFor${user.username}`);
          worldEmitter.removeAllListeners(`messageFor${user.username}`);
          worldEmitter.removeAllListeners(`messageFor${user.username}sRoom`);
          worldEmitter.removeAllListeners(`messageFor${user.username}sZone`);
          worldEmitter.removeAllListeners(`user${user.username}LeavingGame`);
          worldEmitter.removeAllListeners(`user${user.username}ChangingRooms`);
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
