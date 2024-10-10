import logger from "../logger.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import makeMessage from "../types/makeMessage.js";
import getItemBlueprintNamesFromZone from "../util/getItemBlueprintNamesFromZone.js";
import getMobBlueprintNamesFromZone from "../util/getMobBlueprintNamesFromZone.js";
import getRoomOfUser from "../util/getRoomOfUser.js";
import getZoneOfUser from "../util/getZoneofUser.js";
async function erase(parsedCommand, user) {
    const target = parsedCommand.directObject;
    const zone = await getZoneOfUser(user);
    if (!target) {
        worldEmitter.emit(`messageFor${user.username}`, makeMessage(`rejection`, `Erase what? Try ERASE ROOM, ERASE ITEM, or ERASE MOB.`));
        return;
    }
    if (zone.author.toString() !== user._id.toString()) {
        worldEmitter.emit(`messageFor${user.username}`, makeMessage(`rejection`, `You aren't an author for this zone.`));
        return;
    }
    switch (target) {
        case `item`: {
            worldEmitter.emit(`formPromptFor${user.username}`, {
                form: `eraseItemBlueprintForm`,
                itemBlueprintNames: getItemBlueprintNamesFromZone(zone),
            });
            logger.debug(`user ${user.name} requested erase item form.`);
            break;
        }
        case `mob`: {
            worldEmitter.emit(`formPromptFor${user.username}`, {
                form: `eraseMobBlueprintForm`,
                mobBlueprintNames: getMobBlueprintNamesFromZone(zone),
            });
            break;
        }
        case `room`: {
            const originRoom = await getRoomOfUser(user);
            let exitNames = [];
            for (let [key, value] of Object.entries(originRoom.exits)) {
                if (value &&
                    key !== "$__parent" &&
                    key !== "$__" &&
                    key !== "$isNew" &&
                    key !== "$__v" &&
                    key !== "$_id" &&
                    key !== "_doc") {
                    // get the exit's destionation zone (in case it's an external zone)
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
                        let exit = { _id: toRoom._id.toString(), name: `${direction} ${toRoom.name}` };
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
export default erase;
