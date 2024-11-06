// create
// switch on target to open create form for item, mob, room, zone, or user/character
import { itemTypes } from "../constants/ITEM_TYPE.js";
import logger from "../logger.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import getZoneOfUser from "../util/getZoneofUser.js";
import makeMessage from "../util/makeMessage.js";
import unusedExitsForUser from "../util/unusedExitsForUser.js";
import userHasZoneAuthorId from "../util/userHasZoneAuthorId.js";
async function create(parsedCommand, user) {
    try {
        let target = parsedCommand.directObject;
        if (!target) {
            worldEmitter.emit(`messageFor${user.username}`, makeMessage(`rejection`, `Create what?`));
            return;
        }
        const zone = await getZoneOfUser(user);
        if (target === "item" || target === "mob" || target === "room") {
            if (!userHasZoneAuthorId(zone.author.toString(), user)) {
                return;
            }
        }
        switch (target) {
            case `item`: {
                worldEmitter.emit(`formPromptFor${user.username}`, {
                    form: `createItemBlueprintForm`,
                    itemTypes: itemTypes,
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
    catch (error) {
        worldEmitter.emit(`messageFor${user.username}`, makeMessage("rejection", `There was an error on our server. Ralu will have a look at it soon!`));
        if (error instanceof Error) {
            logger.error("editor command encountered an error:", error.message);
        }
        else {
            logger.error("editor command encountered an unknown error:", error);
        }
    }
}
export default create;
