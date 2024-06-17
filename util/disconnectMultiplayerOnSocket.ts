import logger from "../logger.js";
import worldEmitter from "../model/classes/WorldEmitter.js";

async function disconnectMultiplayerOnSocket (socket : any) {
  try {
    // User multiplaying sockets? Disconnect.
    const isMultiplaying = await new Promise((resolve) => {
      worldEmitter.once(`userManagerCheckedMultiplay`, resolve);
      worldEmitter.emit(`socketCheckingMultiplay`, socket.request.session.passport.user._id);
    });
    if (isMultiplaying) {
      logger.warn(
        `disconnectMultiplayerOnSocket found ${socket.request.session.passport.user.name} on more than one socket. Disconnecting.`
      );
      socket.emit(`redirectToLogin`);
      socket.disconnect;
      return true;
    }
    return false;
  } catch (err: any) {
    logger.error(`Error in disconnectMultiplayer: ${err.message}`);
    throw err;
  }
}

export default disconnectMultiplayerOnSocket;