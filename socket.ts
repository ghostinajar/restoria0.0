// socket
import logger from "./logger.js";
import worldEmitter from "./model/classes/WorldEmitter.js";
import { INewRoomData } from "./commands/createRoom.js";
import { IUserData } from "./commands/createUser.js";
import { IUser } from "./model/classes/User.js";
import IMessage from "./types/Message.js";
import makeMessage from "./util/makeMessage.js";
import look from "./commands/look.js";
import authenticateSessionUserOnSocket from "./util/authenticateSessionUserOnSocket.js";
import disconnectMultiplayerOnSocket from "./util/disconnectMultiplayerOnSocket.js";
import setupUserOnSocket from "./util/setupUserOnSocket.js";
import userSentCommandHandler from "./util/userSentCommandHandler.js";
import { IDescription } from "./model/classes/Description.js";
import {
  formPromptForUserHandler,
  messageArrayForUserHandler,
  messageForUserHandler,
  messageForUsersRoomHandler,
  messageForUsersZoneHandler,
  userSubmittedCreateItemBlueprintHandler,
  userSubmittedEditItemBlueprintHandler,
  userSubmittedEditMobBlueprintHandler,
  userSubmittedEditRoomHandler,
  userSubmittedEditZoneHandler,
  userSubmittedEraseItemBlueprintHandler,
  userSubmittedEraseMobBlueprintHandler,
  userSubmittedEraseRoomHandler,
  userSubmittedGotoHandler,
  userSubmittedCreateMobBlueprintHandler,
  userXChangingRoomsHandler,
  userXLeavingGameHandler,
  userSubmittedCreateRoomHandler,
  userSubmittedCreateUserHandler,
  userSubmittedCreateZoneHandler,
  userSubmittedEditUserHandler,
  userSubmittedSuggestHandler,
  userSubmittedSuggestionsHandler,
  userSubmittedCreateExitHandler,
} from "./socketHandlers.js";
import stats from "./commands/stats.js";
import { IEditRoomFormData } from "./commands/editRoom.js";
import { ICreateMobFormData } from "./commands/createMobBlueprint.js";
import { IEditMobFormData } from "./commands/editMobBlueprint.js";
import exits from "./commands/exits.js";
import { ICreateItemBlueprintFormData } from "./commands/createItemBlueprint.js";
import { IEditItemBlueprintFormData } from "./commands/editItemBlueprint.js";
import { IZoneData } from "./commands/createZone.js";
import { purifyCommandInput } from "./util/purify.js";
import { ILocation } from "./model/classes/Location.js";
import { ISuggestion, refersToObjectType } from "./model/classes/Suggestion.js";
import catchErrorHandlerForFunction from "./util/catchErrorHandlerForFunction.js";

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
        async (formData: any) => {
          formPromptForUserHandler(formData, socket);
        }
      );
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
        userInput = purifyCommandInput(userInput);
        userSentCommandHandler(socket, userInput, user);
      });

      socket.on(`userSubmittedCreateExit`, async (direction: string) => {
        await userSubmittedCreateExitHandler(direction, user);
      });

      socket.on(`userSubmittedCreateRoom`, async (roomData: INewRoomData) => {
        await userSubmittedCreateRoomHandler(roomData, user);
      });

      socket.on(`userSubmittedCreateUser`, async (userData: IUserData) => {
        await userSubmittedCreateUserHandler(userData, user);
      });

      socket.on(`userSubmittedCreateZone`, async (zoneData: IZoneData) => {
        await userSubmittedCreateZoneHandler(zoneData, user);
      });

      socket.on(
        `userSubmittedEditItemBlueprint`,
        async (itemBlueprintData: IEditItemBlueprintFormData) => {
          await userSubmittedEditItemBlueprintHandler(itemBlueprintData, user);
        }
      );

      socket.on(
        `userSubmittedEditMobBlueprint`,
        async (mobBlueprintData: IEditMobFormData) => {
          await userSubmittedEditMobBlueprintHandler(mobBlueprintData, user);
        }
      );

      socket.on(
        `userSubmittedEditRoom`,
        async (roomData: IEditRoomFormData) => {
          await userSubmittedEditRoomHandler(roomData, user);
        }
      );

      socket.on(
        `userSubmittedEditUser`,
        async (userDescription: IDescription) => {
          await userSubmittedEditUserHandler(userDescription, user);
        }
      );

      socket.on(`userSubmittedEditZone`, async (zoneData: IZoneData) => {
        await userSubmittedEditZoneHandler(zoneData, user);
      });

      socket.on(
        `userSubmittedEraseItemBlueprint`,
        async (formData: { _id: string; name: string }) => {
          await userSubmittedEraseItemBlueprintHandler(formData, user);
        }
      );

      socket.on(
        `userSubmittedEraseMobBlueprint`,
        async (formData: { _id: string; name: string }) => {
          await userSubmittedEraseMobBlueprintHandler(formData, user);
        }
      );

      socket.on(
        `userSubmittedEraseRoom`,
        async (formData: { _id: string; name: string }) =>
          await userSubmittedEraseRoomHandler(formData, user)
      );

      socket.on(`userSubmittedGoto`, async (gotoFormData: ILocation) => {
        await userSubmittedGotoHandler(gotoFormData, user);
      });

      socket.on(
        `userSubmittedCreateItemBlueprint`,
        async (itemBlueprintData: ICreateItemBlueprintFormData) => {
          await userSubmittedCreateItemBlueprintHandler(
            itemBlueprintData,
            user
          );
        }
      );

      socket.on(
        `userSubmittedCreateMobBlueprint`,
        async (mobBlueprintData: ICreateMobFormData) => {
          await userSubmittedCreateMobBlueprintHandler(mobBlueprintData, user);
        }
      );

      socket.on(
        `userSubmittedSuggest`,
        async (suggestFormData: {
          _id: string;
          refersToObjectType: refersToObjectType;
          body: string;
        }) => {
          await userSubmittedSuggestHandler(suggestFormData, user, socket);
        }
      );

      socket.on(
        `userSubmittedSuggestions`,
        async (suggestions: Array<ISuggestion>) => {
          userSubmittedSuggestionsHandler(suggestions, user, socket);
        }
      );

      // On connection, alert room and look
      let userArrivedMessage = makeMessage(
        `userArrived`,
        `${user.name} entered Restoria.`
      );
      worldEmitter.emit(`messageFor${user.username}sRoom`, userArrivedMessage);
      await look({ commandWord: `look` }, user);
      await exits(user);
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
        } catch (error: unknown){
          catchErrorHandlerForFunction(`socket.on('disconnect')`, error, user?.name);
        }
      });
    });
  } catch (err) {
    throw err;
  }
};

export default setupSocket;
