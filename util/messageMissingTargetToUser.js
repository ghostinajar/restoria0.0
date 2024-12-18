// messageMissingTargetToUser
import worldEmitter from "../model/classes/WorldEmitter.js";
import makeMessage from "./makeMessage.js";
function messageMissingTargetToUser(user, keyword) {
    worldEmitter.emit(`messageFor${user.username}`, makeMessage(`failure`, `You can't seem to find that ${keyword}.`));
}
export default messageMissingTargetToUser;
