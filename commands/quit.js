import worldEmitter from "../model/classes/WorldEmitter.js";
import makeMessage from "../types/makeMessage.js";
import resetUserLocation from "../util/resetUserLocation.js";
async function quit(user) {
    let message = makeMessage(true, `quit`, `Bye bye, ${user.name}!`);
    worldEmitter.emit(`messageFor${user.username}`, message);
    await user.save();
    resetUserLocation(user, `${user.name} used quit, resetting location.`);
    worldEmitter.emit(`user${user.username}LeavingGame`, user);
}
export default quit;
