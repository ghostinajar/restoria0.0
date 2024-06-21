// socket
import logger from "./logger.js";
import worldEmitter from "./model/classes/WorldEmitter.js";
import createUser from "./commands/createUser.js";
import makeMessage from "./types/makeMessage.js";
import look from "./commands/look.js";
import authenticateSessionUserOnSocket from "./util/authenticateSessionUserOnSocket.js";
import disconnectMultiplayerOnSocket from "./util/disconnectMultiplayerOnSocket.js";
import setupUserOnSocket from "./util/setupUserOnSocket.js";
import userSentCommandHandler from "./util/userSentCommandHandler.js";
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
            worldEmitter.removeAllListeners(`messageArrayFor${user.username}`);
            worldEmitter.removeAllListeners(`messageForRoomId`);
            worldEmitter.removeAllListeners(`messageFor${user.username}`);
            worldEmitter.removeAllListeners(`messageFor${user.username}sRoom`);
            worldEmitter.removeAllListeners(`messageFor${user.username}sZone`);
            worldEmitter.removeAllListeners(`user${user.username}LeavingGame`);
            worldEmitter.removeAllListeners(`userChangingRooms`);
            const messageArrayForUserHandler = async (messageArray) => {
                for (let message of messageArray) {
                    socket.emit(`message`, message);
                }
            };
            worldEmitter.on(`messageArrayFor${user.username}`, messageArrayForUserHandler);
            const messageForRoomIdHandler = async (roomId, message) => {
                io.to(roomId).emit(`message`, message);
            };
            worldEmitter.on(`messageForRoomId`, messageForRoomIdHandler);
            const messageForUserHandler = async (message) => {
                socket.emit(`message`, message);
            };
            worldEmitter.on(`messageFor${user.username}`, messageForUserHandler);
            const messageForUsersRoomHandler = async (message) => {
                socket.to(user.location.inRoom.toString()).emit(`message`, message);
            };
            worldEmitter.on(`messageFor${user.username}sRoom`, messageForUsersRoomHandler);
            const messageForUsersZoneHandler = async (message) => {
                socket.to(user.location.inZone.toString()).emit(`message`, message);
            };
            worldEmitter.on(`messageFor${user.username}sZone`, messageForUsersZoneHandler);
            const userXLeavingGameHandler = async (user) => {
                logger.debug(`socket received user${user.name}LeavingGame event. Disconnecting.`);
                socket.emit(`redirectToLogin`, `User ${user.name} left the game.`);
                socket.disconnect;
            };
            worldEmitter.on(`user${user.username}LeavingGame`, userXLeavingGameHandler);
            const userChangingRoomsHandler = async (originRoomId, originZoneId, destinationRoomId, destinationZoneId) => {
                socket.leave(originRoomId);
                socket.join(destinationRoomId);
                if (originZoneId !== destinationZoneId) {
                    socket.leave(originZoneId);
                    socket.join(destinationZoneId);
                }
            };
            worldEmitter.on(`userChangingRooms`, userChangingRoomsHandler);
            // Listen for userSentCommands
            socket.on(`userSentCommand`, async (userInput) => {
                userSentCommandHandler(socket, userInput, user);
            });
            socket.on(`userSubmittedNewCharacter`, async (characterData) => {
                const newUser = await createUser(characterData, user);
            });
            let userArrivedMessage = makeMessage(`userArrived`, `${user.name} entered Restoria.`);
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
                    worldEmitter.removeAllListeners(`messageForRoomId`);
                    worldEmitter.removeAllListeners(`messageFor${user.username}`);
                    worldEmitter.removeAllListeners(`messageFor${user.username}sRoom`);
                    worldEmitter.removeAllListeners(`messageFor${user.username}sZone`);
                    worldEmitter.removeAllListeners(`user${user.username}LeavingGame`);
                    worldEmitter.removeAllListeners(`userChangingRooms`);
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
