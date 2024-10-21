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
        case `item`: {
            worldEmitter.emit(`formPromptFor${user.username}`, {
                form: `createItemBlueprintForm`,
            });
            break;
        }
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
        case `character`:
        case `user`: {
            worldEmitter.emit(`formPromptFor${user.username}`, {
                form: `createUserForm`,
            });
            break;
        }
        case `zone`: {
            if (user.unpublishedZoneTally >= 5) {
                worldEmitter.emit(`messageFor${user.username}`, makeMessage(`rejection`, `You already have 5 zones in progress! Work on publishing one of them first.`));
                break;
            }
            worldEmitter.emit(`formPromptFor${user.username}`, {
                form: `createZoneForm`,
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
