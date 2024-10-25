import worldEmitter from "../model/classes/WorldEmitter.js";
import makeMessage from "../util/makeMessage.js";
import resetUserLocation from "../util/resetUserLocation.js";
import look from "./look.js";
async function recall(user) {
    await resetUserLocation(user);
    worldEmitter.emit(`messageFor${user.username}`, makeMessage(`success`, `You close your eyes and concentrate. When you open them, you're back in Restoria City.`));
    await look({ commandWord: "look" }, user);
}
export default recall;
