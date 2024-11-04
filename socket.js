// socket
import logger from "./logger.js";
import worldEmitter from "./model/classes/WorldEmitter.js";
import createRoom from "./commands/createRoom.js";
import createUser from "./commands/createUser.js";
import makeMessage from "./util/makeMessage.js";
import look from "./commands/look.js";
import authenticateSessionUserOnSocket from "./util/authenticateSessionUserOnSocket.js";
import disconnectMultiplayerOnSocket from "./util/disconnectMultiplayerOnSocket.js";
import setupUserOnSocket from "./util/setupUserOnSocket.js";
import userSentCommandHandler from "./util/userSentCommandHandler.js";
import editUser from "./commands/editUser.js";
import { formPromptForUserHandler, handleSuggestion, messageArrayForUserHandler, messageForUserHandler, messageForUsersRoomHandler, messageForUsersZoneHandler, userXChangingRoomsHandler, userXLeavingGameHandler, } from "./socketHandlers.js";
import stats from "./commands/stats.js";
import editRoom from "./commands/editRoom.js";
import getRoomOfUser from "./util/getRoomOfUser.js";
import createMobBlueprint from "./commands/createMobBlueprint.js";
import editMobBlueprint from "./commands/editMobBlueprint.js";
import exits from "./commands/exits.js";
import createItemBlueprint from "./commands/createItemBlueprint.js";
import editItemBlueprint from "./commands/editItemBlueprint.js";
import createZone from "./commands/createZone.js";
import editZone from "./commands/editZone.js";
import getZoneOfUser from "./util/getZoneofUser.js";
import purifyDescriptionOfObject, { purifyCommandInput, } from "./util/purify.js";
import relocateUser from "./util/relocateUser.js";
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
            socket.on(`userSubmittedEditItemBlueprint`, async (itemId, itemBlueprintData) => {
                purifyDescriptionOfObject(itemBlueprintData);
                await editItemBlueprint(itemId, itemBlueprintData, user);
                stats(user);
            });
            socket.on(`userSubmittedEditMobBlueprint`, async (mobId, mobBlueprintData) => {
                purifyDescriptionOfObject(mobBlueprintData);
                await editMobBlueprint(mobId, mobBlueprintData, user);
                stats(user);
            });
            socket.on(`userSubmittedEditRoom`, async (roomData) => {
                const room = await getRoomOfUser(user);
                purifyDescriptionOfObject(roomData);
                await editRoom(room, roomData, user);
                stats(user);
            });
            socket.on(`userSubmittedEditZone`, async (zoneData) => {
                purifyDescriptionOfObject(zoneData);
                await editZone(zoneData, user);
                stats(user);
            });
            socket.on(`userSubmittedEraseItemBlueprint`, async (formData) => {
                const zone = await getZoneOfUser(user);
                await zone.eraseItemBlueprintById(formData._id);
                logger.info(`User ${user.name} erased itemBlueprint ${formData.name}, id: ${formData._id}`);
                let message = makeMessage("success", `You permanently erased the itemBlueprint for ${formData.name}.`);
                worldEmitter.emit(`messageFor${user.username}`, message);
            });
            socket.on(`userSubmittedEraseMobBlueprint`, async (formData) => {
                const zone = await getZoneOfUser(user);
                await zone.eraseMobBlueprintById(formData._id);
                logger.info(`User ${user.name} erased mobBlueprint ${formData.name}, id: ${formData._id}`);
                let message = makeMessage("success", `You permanently erased the mobBlueprint for ${formData.name}.`);
                worldEmitter.emit(`messageFor${user.username}`, message);
            });
            socket.on(`userSubmittedEraseRoom`, async (formData) => {
                const zone = await getZoneOfUser(user);
                await zone.eraseRoomById(formData._id);
                logger.info(`User ${user.name} erased room ${formData.name}, id: ${formData._id}`);
                let message = makeMessage("success", `You permanently erased the room ${formData.name}.`);
                worldEmitter.emit(`messageFor${user.username}`, message);
            });
            socket.on(`userSubmittedGoto`, async (gotoFormData) => {
                worldEmitter.emit(`messageFor${user.username}sRoom`, makeMessage(`success`, `${user.name} disappears.`));
                worldEmitter.emit(`messageFor${user.username}`, makeMessage(`success`, `You close your eyes for a moment, imagine the location, and appear there.`));
                await relocateUser(user, gotoFormData);
                worldEmitter.emit(`messageFor${user.username}sRoom`, makeMessage(`success`, `${user.name} appears.`));
            });
            socket.on(`userSubmittedNewItemBlueprint`, async (itemBlueprintData) => {
                purifyDescriptionOfObject(itemBlueprintData);
                const newItemBlueprint = await createItemBlueprint(itemBlueprintData, user);
                stats(user);
            });
            socket.on(`userSubmittedNewMobBlueprint`, async (mobBlueprintData) => {
                purifyDescriptionOfObject(mobBlueprintData);
                const newMobBlueprint = await createMobBlueprint(mobBlueprintData, user);
                stats(user);
            });
            socket.on(`userSubmittedNewRoom`, async (roomData) => {
                purifyDescriptionOfObject(roomData);
                const newRoom = await createRoom(roomData, user);
                stats(user);
            });
            socket.on(`userSubmittedNewUser`, async (userData) => {
                purifyDescriptionOfObject(userData);
                const newUser = await createUser(userData, user);
                stats(user);
            });
            socket.on(`userSubmittedNewZone`, async (zoneData) => {
                purifyDescriptionOfObject(zoneData);
                const newZone = await createZone(zoneData, user);
                stats(user);
            });
            socket.on(`userSubmittedUserDescription`, async (userDescription) => {
                purifyDescriptionOfObject(userDescription);
                await editUser(user, userDescription);
                stats(user);
            });
            socket.on(`userSubmittedSuggest`, async (suggestionFormData) => {
                handleSuggestion(suggestionFormData, user);
                socket.emit('message', makeMessage('success', `We saved your suggestion for this ${suggestionFormData.refersToObjectType}.`));
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
