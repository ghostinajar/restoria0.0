import worldEmitter from "../model/classes/WorldEmitter.js";
import makeMessage from "../types/makeMessage.js";
async function edit(parsedCommand, user) {
    let target = parsedCommand.directObject;
    if (!target) {
        worldEmitter.emit(`messageFor${user.username}`, makeMessage(`rejection`, `Edit what?`));
        return;
    }
    switch (target) {
        default: {
            worldEmitter.emit(`messageFor${user.username}`, makeMessage(`rejection`, `Edit what?`));
            return;
        }
    }
}
export default edit;
