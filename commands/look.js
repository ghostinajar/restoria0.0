// look
// shows the user what's in their room, 
// or the description and contents of a target
import logger from "../logger.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import getRoomOfUser from "../util/getRoomOfUser.js";
import lookRoom from "./lookRoom.js";
import lookTarget from "./lookTarget.js";
import makeMessage from "../util/makeMessage.js";
async function look(parsedCommand, user) {
    try {
        const room = await getRoomOfUser(user);
        let lookArray = [];
        let target = parsedCommand.directObject;
        if (target === "room") {
            lookRoom(room, user, lookArray);
            worldEmitter.emit(`messageArrayFor${user.username}`, lookArray);
            return;
        }
        if (target) {
            lookTarget(target.toLowerCase(), room, lookArray);
            worldEmitter.emit(`messageArrayFor${user.username}`, lookArray);
            return;
        }
        else {
            lookRoom(room, user, lookArray);
        }
        worldEmitter.emit(`messageArrayFor${user.username}`, lookArray);
    }
    catch (error) {
        worldEmitter.emit(`messageFor${user.username}`, makeMessage("rejection", `There was an error on our server. Ralu will have a look at it soon!`));
        if (error instanceof Error) {
            logger.error(`"look" error for user ${user.username}: ${error.message}`);
        }
        else {
            logger.error(`"look" error for user ${user.username}: ${error}`);
        }
    }
}
export default look;
