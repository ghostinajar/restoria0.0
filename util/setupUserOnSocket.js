import worldEmitter from "../model/classes/WorldEmitter.js";
import logger from "../logger.js";
async function setupUserOnSocket(socket) {
    try {
        // Get user, alert userManager
        const user = await new Promise((resolve) => {
            worldEmitter.once(`userManagerAddedUser${socket.request.session.passport.user._id}`, resolve);
            worldEmitter.emit(`socketConnectingUser`, socket.request.session.passport.user._id);
        });
        if (!user) {
            logger.error(`setupUserOnSocket couldn't create a user`);
            socket.emit(`redirectToLogin`);
            socket.disconnect();
            return;
        }
        // Add to location's ioRoom on login
        socket.join(user.location.inRoom.toString());
        socket.join(user.location.inZone.toString());
        return user;
    }
    catch (err) {
        logger.error(`Error in setupUserOnSocket: ${err.message}`);
    }
}
export default setupUserOnSocket;
