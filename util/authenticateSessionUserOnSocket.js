// authenticateSessionUserOnSocket
import logger from "../logger.js";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
function authenticateSessionUserOnSocket(socket) {
    try {
        // Not authenticated? Disconnect.
        if (!socket.request.session.passport ||
            !socket.request.session.passport.user) {
            logger.warn(`authenticateSessionUserOnSocket couldn't find missing passport or passport.user`);
            socket.emit(`redirectToLogin`);
            socket.disconnect();
            return false;
        }
        // logger.debug(
        //   `socket.request.session.passport.user authenticated, contains ${JSON.stringify(
        //     socket.request.session.passport.user
        //   )}`
        // );
        return true;
    }
    catch (error) {
        catchErrorHandlerForFunction(`authenticateSessionUserOnSocket`, error);
    }
}
export default authenticateSessionUserOnSocket;
