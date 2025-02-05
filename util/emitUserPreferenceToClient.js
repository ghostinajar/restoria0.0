// emitUserPreferenceToClient
// use after changing a user preferece to message the change to that client
import worldEmitter from "../model/classes/WorldEmitter.js";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
async function emitUserPreferenceToClient(user, preferenceType, setting) {
    try {
        worldEmitter.emit(`preferenceFor${user.username}`, {
            type: preferenceType,
            setting: setting,
        });
    }
    catch (error) {
        catchErrorHandlerForFunction(`emitUserPreferenceToClient`, error, user?.name);
    }
}
export default emitUserPreferenceToClient;
