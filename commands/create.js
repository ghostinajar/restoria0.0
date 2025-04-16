// create
// switch on target to open create form for item, mob, room, zone, or user/character
import { directionCorrectionString, directions, directionsAbbrev, expandAbbreviatedDirection, } from "../constants/DIRECTIONS.js";
import { itemTypes } from "../constants/ITEM_TYPE.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import getAvailableExitsForCreateExit from "../util/getAvailableExitsForCreateExit.js";
import getAvailableExitsForCreateRoom from "../util/getAvailableExitsForCreateRoom.js";
import getZoneOfUser from "../util/getZoneofUser.js";
import makeMessage from "../util/makeMessage.js";
import messageToUsername from "../util/messageToUsername.js";
import userHasZoneAuthorId from "../util/userHasZoneAuthorId.js";
import create_handleCreateRoomWithDirection from "./create_handleCreateRoomWithDirection.js";
import createExit from "./createExit.js";
import help from "./help.js";
async function create(parsedCommand, user) {
    try {
        let target = parsedCommand.directObject;
        if (!target) {
            worldEmitter.emit(`messageFor${user.username}`, makeMessage(`rejection`, `Create what? Try CREATE ITEM, CREATE MOB, CREATE ROOM, or CREATE ZONE.`));
            return;
        }
        const zone = await getZoneOfUser(user);
        if (!zone) {
            throw new Error(`Couldn't get ${user.username}'s zone.`);
        }
        if (target === "item" || target === "mob" || target === "room") {
            if (!userHasZoneAuthorId(zone.author.toString(), user)) {
                return;
            }
        }
        switch (target) {
            case `exit`: {
                help({
                    commandWord: "help",
                    directObject: "create_exit",
                }, user);
                const providedDirection = parsedCommand.indirectObject?.toLowerCase();
                if (!providedDirection) {
                    messageToUsername(user.username, `Which direction? E.g. CREATE EXIT NORTH or CREATE EXIT N.`, `rejection`, true);
                    return;
                }
                console.log(parsedCommand);
                console.log(providedDirection);
                // handle invalid direction provided
                if (!directions.includes(providedDirection) &&
                    !directionsAbbrev.includes(providedDirection)) {
                    messageToUsername(user.username, directionCorrectionString, `rejection`, true);
                    return;
                }
                // handle direction abbreviation
                const expandedDirection = expandAbbreviatedDirection(providedDirection);
                if (!expandedDirection) {
                    throw new Error(`Couldn't expand direction ${providedDirection} for ${user.username}.`);
                }
                // handle no room in that direction
                const availableExits = await getAvailableExitsForCreateExit(user);
                if (!availableExits || !availableExits.includes(expandedDirection)) {
                    messageToUsername(user.username, `There's an existing exit there, or no room to exit to! Try another direction.`, `rejection`, true);
                    return;
                }
                await createExit(expandedDirection, user);
                break;
            }
            case `object`:
                worldEmitter.emit(`messageFor${user.username}`, makeMessage(`help`, `Objects are called items in Restoria.`));
            case `item`: {
                help({
                    commandWord: "help",
                    directObject: "create_item",
                }, user);
                worldEmitter.emit(`formPromptFor${user.username}`, {
                    form: `createItemBlueprintForm`,
                    itemTypes: itemTypes,
                });
                break;
            }
            case `monster`:
            case `npc`:
                worldEmitter.emit(`messageFor${user.username}`, makeMessage(`help`, `Monsters and NPCs are considered mobs in Restoria.`));
            case `mob`: {
                help({
                    commandWord: "help",
                    directObject: "create_mob",
                }, user);
                worldEmitter.emit(`formPromptFor${user.username}`, {
                    form: `createMobBlueprintForm`,
                });
                break;
            }
            case `room`: {
                help({
                    commandWord: "help",
                    directObject: "create_room",
                }, user);
                const availableDirections = await getAvailableExitsForCreateRoom(user);
                // handle no available directions for new room
                if (availableDirections.length === 0) {
                    worldEmitter.emit(`messageFor${user.username}`, makeMessage(`rejection`, `There are already rooms in every direction! Create somewhere else.`));
                    break;
                }
                else {
                    // handle direct room creation if user provided direction
                    if (parsedCommand.indirectObject) {
                        await create_handleCreateRoomWithDirection(parsedCommand.indirectObject, user, parsedCommand.string);
                        break;
                    }
                    else {
                        // handle room creation form if no direction provided
                        worldEmitter.emit(`formPromptFor${user.username}`, {
                            form: `createRoomForm`,
                            availableDirections: availableDirections,
                        });
                        break;
                    }
                }
            }
            case `zone`: {
                if (user.unpublishedZoneTally >= 5 && !user.isAdmin) {
                    worldEmitter.emit(`messageFor${user.username}`, makeMessage(`rejection`, `You already have 5 zones in progress! Work on publishing one of them first.`));
                    break;
                }
                help({
                    commandWord: "help",
                    directObject: "create_zone",
                }, user);
                worldEmitter.emit(`formPromptFor${user.username}`, {
                    form: `createZoneForm`,
                });
                break;
            }
            default: {
                worldEmitter.emit(`messageFor${user.username}`, makeMessage(`rejection`, `Create what? Try CREATE ITEM, CREATE MOB, CREATE ROOM, or CREATE ZONE.`));
                return;
            }
        }
    }
    catch (error) {
        catchErrorHandlerForFunction("create", error, user.name);
    }
}
export default create;
