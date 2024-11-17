import logger from "../logger.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
async function disconnectMultiplayerOnSocket(socket) {
    try {
        // User multiplaying sockets? Disconnect.
        const isMultiplaying = await new Promise((resolve) => {
            worldEmitter.once(`userManagerCheckedMultiplayFor${socket.request.session.passport.user._id}`, resolve);
            worldEmitter.emit(`socketCheckingMultiplay`, socket.request.session.passport.user._id);
        });
        if (isMultiplaying) {
            logger.warn(`disconnectMultiplayerOnSocket found ${socket.request.session.passport.user.name} on more than one socket. Disconnecting.`);
            socket.emit(`redirectToLogin`);
            socket.disconnect;
            return true;
        }
        return false;
    }
    catch (error) {
        catchErrorHandlerForFunction(`disconnectMultiplayerOnSocket`, error);
        return false;
    }
}
export default disconnectMultiplayerOnSocket;
