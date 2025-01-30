// messageToUsername
// utility to emit message to a user by username
import worldEmitter from "../model/classes/WorldEmitter.js";
import makeMessage from "./makeMessage.js";
async function messageToUsername(username, message, messageType = "info", safe = false) {
    try {
        if (safe) {
            worldEmitter.emit(`safeMessageFor${username}`, makeMessage(messageType, message));
            return;
        }
        else {
            worldEmitter.emit(`messageFor${username}`, makeMessage(messageType, message));
        }
    }
    catch (error) {
        console.log(`Error in messageToUsername: ${error}`);
    }
}
export default messageToUsername;
