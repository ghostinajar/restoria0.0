import worldEmitter from "../model/classes/WorldEmitter.js";
import makeMessage from "../util/makeMessage.js";
import getItemBlueprintNamesFromZone from "../util/getItemBlueprintNamesFromZone.js";
import getMobBlueprintNamesFromZone from "../util/getMobBlueprintNamesFromZone.js";
import getRoomOfUser from "../util/getRoomOfUser.js";
import getZoneOfUser from "../util/getZoneofUser.js";
import userHasZoneAuthorId from "../util/userHasZoneAuthorId.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import { directions } from "../constants/DIRECTIONS.js";
import help from "./help.js";
async function erase(parsedCommand, user) {
    try {
        const target = parsedCommand.directObject;
        const zone = await getZoneOfUser(user);
        if (!zone) {
            throw new Error(`Couldn't get ${user.username}'s zone.`);
        }
        if (!target) {
            worldEmitter.emit(`messageFor${user.username}`, makeMessage(`rejection`, `Erase what? Try ERASE ROOM, ERASE ITEM, or ERASE MOB.`));
            return;
        }
        if (target === "user" || target === "character") {
            worldEmitter.emit(`messageFor${user.username}`, makeMessage(`rejection`, `To erase a user, contact Ralu or another game administrator.`));
            worldEmitter.emit(`messageFor${user.username}`, makeMessage(`rejection`, `Except in special circumstances, we'll only erase one of your users per month.`));
            return;
        }
        if (target === "zone") {
            worldEmitter.emit(`messageFor${user.username}`, makeMessage(`rejection`, `You can't erase a zone. Edit or erase its contents instead.`));
            return;
        }
        if (!userHasZoneAuthorId(zone.author.toString(), user)) {
            return;
        }
        switch (target) {
            case `exit`: {
                help({
                    commandWord: "help",
                    directObject: "erase_exit",
                }, user);
                const room = await getRoomOfUser(user);
                if (!room) {
                    throw new Error(`No room found for user ${user.name}`);
                }
                let eraseableExits = [];
                directions.forEach((direction) => {
                    if (room.exits[direction]) {
                        eraseableExits.push(direction);
                    }
                });
                worldEmitter.emit(`formPromptFor${user.username}`, {
                    form: `eraseExitForm`,
                    eraseableExits: eraseableExits,
                });
                break;
            }
            case `object`:
                worldEmitter.emit(`messageFor${user.username}`, makeMessage(`help`, `Objects are called items in Restoria.`));
            case `item`: {
                help({
                    commandWord: "help",
                    directObject: "erase",
                }, user);
                worldEmitter.emit(`formPromptFor${user.username}`, {
                    form: `eraseItemBlueprintForm`,
                    itemBlueprintNames: getItemBlueprintNamesFromZone(zone),
                });
                break;
            }
            case `monster`:
            case `npc`:
                worldEmitter.emit(`messageFor${user.username}`, makeMessage(`help`, `Monsters and NPCs are considered mobs in Restoria.`));
            case `mob`: {
                help({
                    commandWord: "help",
                    directObject: "erase",
                }, user);
                worldEmitter.emit(`formPromptFor${user.username}`, {
                    form: `eraseMobBlueprintForm`,
                    mobBlueprintNames: getMobBlueprintNamesFromZone(zone),
                });
                break;
            }
            case `room`: {
                help({
                    commandWord: "help",
                    directObject: "erase",
                }, user);
                const originRoom = await getRoomOfUser(user);
                if (!originRoom) {
                    throw new Error(`Room not found for user ${user.name}`);
                }
                let exitNames = [];
                for (let [key, value] of Object.entries(originRoom.exits)) {
                    if (value &&
                        key !== "$__parent" &&
                        key !== "$__" &&
                        key !== "$isNew" &&
                        key !== "$__v" &&
                        key !== "$_id" &&
                        key !== "_doc") {
                        // get the exit's destination zone (in case it's an external zone)
                        // logger.debug(`exits command look for destination zone for ${key} exit from ${originRoom.name}...`);
                        let toZone = await new Promise((resolve) => {
                            worldEmitter.once(`zone${value.destinationLocation.inZone.toString()}Loaded`, resolve);
                            worldEmitter.emit(`zoneRequested`, value.destinationLocation.inZone);
                        });
                        // get room of exit
                        // logger.debug(`exits command found zone ${toZone.name}, finding room for ${key} exit...`);
                        const toRoom = toZone.rooms.find((room) => room._id.toString() ===
                            value.destinationLocation.inRoom.toString());
                        let direction = ``;
                        switch (key) {
                            case "north": {
                                direction = `North:  `;
                                break;
                            }
                            case "east": {
                                direction = `East:   `;
                                break;
                            }
                            case "south": {
                                direction = `South:  `;
                                break;
                            }
                            case "west": {
                                direction = `West:   `;
                                break;
                            }
                            case "up": {
                                direction = `Up:     `;
                                break;
                            }
                            case "down": {
                                direction = `Down:   `;
                                break;
                            }
                            default:
                                break;
                        }
                        if (toRoom) {
                            let exit = {
                                _id: toRoom._id.toString(),
                                name: `${direction} ${toRoom.name}`,
                            };
                            exitNames.push(exit);
                        }
                    }
                }
                worldEmitter.emit(`formPromptFor${user.username}`, {
                    form: `eraseRoomForm`,
                    exitNames: exitNames,
                });
                break;
            }
            default: {
                worldEmitter.emit(`messageFor${user.username}`, makeMessage(`rejection`, `Uh, you can't erase that. Try ERASE ROOM, ERASE ITEM, or ERASE MOB.`));
                return;
            }
        }
    }
    catch (error) {
        catchErrorHandlerForFunction("erase", error, user.name);
    }
}
export default erase;
