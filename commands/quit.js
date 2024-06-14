import worldEmitter from "../model/classes/WorldEmitter.js";
import resetUserLocation from "../util/resetUserLocation.js";
async function quit(user) {
    await user.save();
    resetUserLocation(user, `${user.name} used quit, resetting location.`);
    worldEmitter.emit(`user${user.username}LeavingGame`, user);
}
export default quit;
