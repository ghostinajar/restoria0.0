import worldEmitter from "../model/classes/WorldEmitter.js";
import getRoomOfUser from "../util/getRoomOfUser.js";
import lookRoom from "./lookRoom.js";
import lookTarget from "./lookTarget.js";
async function look(parsedCommand, user) {
    // logger.debug(`look command initiated`);
    const room = await getRoomOfUser(user);
    let lookArray = [];
    let target = parsedCommand.directObject;
    if (target === "room") {
        lookRoom(room, user, lookArray);
        worldEmitter.emit(`messageArrayFor${user.username}`, lookArray);
        return;
    }
    if (target) {
        // logger.debug(`look command targeting ${target}`);
        lookTarget(target.toLowerCase(), room, lookArray);
        // logger.debug(`lookArray gathered: ${JSON.stringify(lookArray)}`);
        worldEmitter.emit(`messageArrayFor${user.username}`, lookArray);
        return;
    }
    else {
        lookRoom(room, user, lookArray);
    }
    // logger.debug(`lookArray gathered: ${JSON.stringify(lookArray)}`);
    worldEmitter.emit(`messageArrayFor${user.username}`, lookArray);
}
export default look;
