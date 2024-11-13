// look
// shows the user what's in their room,
// or the description and contents of a target
import worldEmitter from "../model/classes/WorldEmitter.js";
import getRoomOfUser from "../util/getRoomOfUser.js";
import lookRoom from "./lookRoom.js";
import lookTarget from "./lookTarget.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
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
        catchErrorHandlerForFunction("look", error, user.name);
    }
}
export default look;
