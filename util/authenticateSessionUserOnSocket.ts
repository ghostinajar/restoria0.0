// authenticateSessionUserOnSocket
import logger from "../logger.js";

function authenticateSessionUserOnSocket(socket: any) {
  try {
    // Not authenticated? Disconnect.
    if (
      !socket.request.session.passport ||
      !socket.request.session.passport.user
    ) {
      logger.warn(
        `authenticateSessionUserOnSocket couldn't find missing passport or passport.user`
      );
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
  } catch (err: any) {
    logger.error(`Error in authenticateSessionUserOnSocket: ${err.message}`);
    throw err;
  }
}

export default authenticateSessionUserOnSocket;
