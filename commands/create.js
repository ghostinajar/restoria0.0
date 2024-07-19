import worldEmitter from "../model/classes/WorldEmitter.js";
import makeMessage from "../types/makeMessage.js";
import unusedExitsForUser from "../util/unusedExitsForUser.js";
async function create(parsedCommand, user) {
    let target = parsedCommand.directObject;
    if (!target) {
        worldEmitter.emit(`messageFor${user.username}`, makeMessage(`rejection`, `Create what?`));
        return;
    }
    switch (target) {
        case `mob`: {
            worldEmitter.emit(`formPromptFor${user.username}`, {
                form: `createMobBlueprintForm`,
            });
            break;
        }
        case `room`: {
            const unusedExits = await unusedExitsForUser(user);
            worldEmitter.emit(`formPromptFor${user.username}`, {
                form: `createRoomForm`,
                unusedExits: unusedExits,
            });
            break;
        }
        case `user`: {
            worldEmitter.emit(`formPromptFor${user.username}`, {
                form: `createUserForm`,
            });
            break;
        }
        default: {
            worldEmitter.emit(`messageFor${user.username}`, makeMessage(`rejection`, `Create what?`));
            return;
        }
    }
}
export default create;
