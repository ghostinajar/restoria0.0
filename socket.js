// socket
import logger from "./logger.js";
import worldEmitter from "./model/classes/WorldEmitter.js";
import makeMessage from "./util/makeMessage.js";
import look from "./commands/look.js";
import authenticateSessionUserOnSocket from "./util/authenticateSessionUserOnSocket.js";
import disconnectMultiplayerOnSocket from "./util/disconnectMultiplayerOnSocket.js";
import setupUserOnSocket from "./util/setupUserOnSocket.js";
import userSentCommandHandler from "./util/userSentCommandHandler.js";
import { formPromptForUserHandler, messageArrayForUserHandler, messageForUserHandler, messageForUsersRoomHandler, messageForUsersZoneHandler, userSubmittedCreateItemBlueprintHandler, userSubmittedEditItemBlueprintHandler, userSubmittedEditMobBlueprintHandler, userSubmittedEditRoomHandler, userSubmittedEditZoneHandler, userSubmittedEraseItemBlueprintHandler, userSubmittedEraseMobBlueprintHandler, userSubmittedEraseRoomHandler, userSubmittedGotoHandler, userSubmittedCreateMobBlueprintHandler, userXChangingRoomsHandler, userXLeavingGameHandler, userSubmittedCreateRoomHandler, userSubmittedCreateUserHandler, userSubmittedCreateZoneHandler, userSubmittedEditUserHandler, userSubmittedSuggestHandler, } from "./socketHandlers.js";
import stats from "./commands/stats.js";
import exits from "./commands/exits.js";
import getZoneOfUser from "./util/getZoneofUser.js";
import { purifyCommandInput } from "./util/purify.js";
import saveSuggestions from "./commands/saveSuggestions.js";
const setupSocket = (io) => {
    try {
        io.on(`connection`, async (socket) => {
            authenticateSessionUserOnSocket(socket);
            if (!authenticateSessionUserOnSocket(socket)) {
                return;
            }
            if (await disconnectMultiplayerOnSocket(socket)) {
                return;
            }
            const user = await setupUserOnSocket(socket);
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
            worldEmitter.on(`formPromptFor${user.username}`, async (formData) => {
                formPromptForUserHandler(formData, socket);
            });
            worldEmitter.on(`messageArrayFor${user.username}`, async (messageArray) => {
                messageArrayForUserHandler(messageArray, socket);
            });
            worldEmitter.on(`messageFor${user.username}`, async (message) => {
                messageForUserHandler(message, socket);
            });
            worldEmitter.on(`messageFor${user.username}sRoom`, async (message) => {
                messageForUsersRoomHandler(message, socket, user);
            });
            worldEmitter.on(`messageFor${user.username}sZone`, async (message) => {
                messageForUsersZoneHandler(message, socket, user);
            });
            worldEmitter.on(`user${user.username}LeavingGame`, async (user) => {
                userXLeavingGameHandler(user, socket);
            });
            worldEmitter.on(`user${user.username}ChangingRooms`, async (originRoomId, originZoneId, destinationRoomId, destinationZoneId) => {
                userXChangingRoomsHandler(originRoomId, originZoneId, destinationRoomId, destinationZoneId, socket, user);
            });
            // Listen for client events
            socket.on(`userSentCommand`, async (userInput) => {
                userInput = purifyCommandInput(userInput);
                userSentCommandHandler(socket, userInput, user);
            });
            socket.on(`userSubmittedCreateRoom`, async (roomData) => {
                await userSubmittedCreateRoomHandler(roomData, user);
            });
            socket.on(`userSubmittedCreateUser`, async (userData) => {
                await userSubmittedCreateUserHandler(userData, user);
            });
            socket.on(`userSubmittedCreateZone`, async (zoneData) => {
                await userSubmittedCreateZoneHandler(zoneData, user);
            });
            socket.on(`userSubmittedEditItemBlueprint`, async (itemBlueprintData) => {
                await userSubmittedEditItemBlueprintHandler(itemBlueprintData, user);
            });
            socket.on(`userSubmittedEditMobBlueprint`, async (mobId, mobBlueprintData) => {
                await userSubmittedEditMobBlueprintHandler(mobId, mobBlueprintData, user);
            });
            socket.on(`userSubmittedEditRoom`, async (roomData) => {
                await userSubmittedEditRoomHandler(roomData, user);
            });
            socket.on(`userSubmittedEditUser`, async (userDescription) => {
                await userSubmittedEditUserHandler(userDescription, user);
            });
            socket.on(`userSubmittedEditZone`, async (zoneData) => {
                await userSubmittedEditZoneHandler(zoneData, user);
            });
            socket.on(`userSubmittedEraseItemBlueprint`, async (formData) => {
                await userSubmittedEraseItemBlueprintHandler(formData, user);
            });
            socket.on(`userSubmittedEraseMobBlueprint`, async (formData) => {
                await userSubmittedEraseMobBlueprintHandler(formData, user);
            });
            socket.on(`userSubmittedEraseRoom`, async (formData) => await userSubmittedEraseRoomHandler(formData, user));
            socket.on(`userSubmittedGoto`, async (gotoFormData) => {
                await userSubmittedGotoHandler(gotoFormData, user);
            });
            socket.on(`userSubmittedCreateItemBlueprint`, async (itemBlueprintData) => {
                await userSubmittedCreateItemBlueprintHandler(itemBlueprintData, user);
            });
            socket.on(`userSubmittedCreateMobBlueprint`, async (mobBlueprintData) => {
                await userSubmittedCreateMobBlueprintHandler(mobBlueprintData, user);
            });
            socket.on(`userSubmittedSuggest`, async (suggestFormData) => {
                await userSubmittedSuggestHandler(suggestFormData, user, socket);
            });
            socket.on(`userSubmittedSuggestions`, async (suggestions) => {
                const zone = await getZoneOfUser(user);
                if (!zone) {
                    throw new Error(`Couldn't get ${user.username}'s zone.`);
                }
                await saveSuggestions(suggestions, zone);
                socket.emit("message", makeMessage("success", `We saved the suggestions for ${zone.name}.`));
            });
            // On connection, alert room and look
            let userArrivedMessage = makeMessage(`userArrived`, `${user.name} entered Restoria.`);
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
                }
                catch (err) {
                    logger.error(err);
                }
            });
        });
    }
    catch (err) {
        throw err;
    }
};
export default setupSocket;
