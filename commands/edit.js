import worldEmitter from "../model/classes/WorldEmitter.js";
import makeMessage from "../types/makeMessage.js";
import getRoomOfUser from "../util/getRoomOfUser.js";
import getZoneOfUser from "../util/getZoneofUser.js";
async function edit(parsedCommand, user) {
    let target = parsedCommand.directObject;
    const zone = await getZoneOfUser(user);
    if (target !== "user" && zone.author.toString() !== user._id.toString()) {
        worldEmitter.emit(`messageFor${user.username}`, makeMessage(`rejection`, `You aren't an author for this zone.`));
        return;
    }
    if (!target) {
        worldEmitter.emit(`messageFor${user.username}`, makeMessage(`rejection`, `Edit what?`));
        return;
    }
    switch (target) {
        case `item`: {
            worldEmitter.emit(`formPromptFor${user.username}`, {
                form: `editItemSelect`,
                itemBlueprintList: getItemBlueprintList(zone),
            });
            break;
        }
        case `mob`: {
            const zone = await getZoneOfUser(user);
            worldEmitter.emit(`formPromptFor${user.username}`, {
                form: `editMobSelect`,
                mobBlueprintList: getMobBlueprintList(zone),
            });
            break;
        }
        case `room`: {
            const room = await getRoomOfUser(user);
            const itemBlueprintList = getItemBlueprintList(zone);
            const mobBlueprintList = getMobBlueprintList(zone);
            const itemNodesList = getItemNodesList(room, zone);
            const mobNodesList = getMobNodesList(room, zone);
            worldEmitter.emit(`formPromptFor${user.username}`, {
                form: `editRoomForm`,
                roomData: {
                    _id: room._id,
                    name: room.name,
                    description: room.description,
                    isDark: room.isDark,
                    isIndoors: room.isIndoors,
                    isOnWater: room.isOnWater,
                    isUnderwater: room.isUnderwater,
                    noMounts: room.noMagic,
                    noMobs: room.noMobs,
                    noMagic: room.noMagic,
                    noCombat: room.noCombat,
                    mobNodes: mobNodesList,
                    itemNodes: itemNodesList,
                    exits: room.exits,
                },
                zoneData: {
                    items: itemBlueprintList,
                    mobs: mobBlueprintList,
                    rooms: zone.rooms,
                },
            });
            break;
        }
        case `user`: {
            worldEmitter.emit(`formPromptFor${user.username}`, {
                form: `editUserForm`,
                examine: user.description.examine,
                study: user.description.study,
                research: user.description.research,
            });
            break;
        }
        default: {
            worldEmitter.emit(`messageFor${user.username}`, makeMessage(`rejection`, `Edit what?`));
            return;
        }
    }
}
function getItemBlueprintList(zone) {
    const itemBlueprintList = zone.itemBlueprints.map((blueprint) => {
        return { id: blueprint._id, value: blueprint.name };
    });
    return itemBlueprintList;
}
function getMobBlueprintList(zone) {
    const mobBlueprintList = zone.mobBlueprints.map((blueprint) => {
        return { id: blueprint._id, value: blueprint.name };
    });
    return mobBlueprintList;
}
function getItemNodesList(room, zone) {
    let itemNodesList = [];
    for (let node of room.itemNodes) {
        const itemName = zone.itemBlueprints.find(blueprint => { blueprint._id === node.loadsItemBlueprintId; })?.name;
        //TODO handle cases where the item originates in another zone
        const nodeObject = {
            nodeId: node._id,
            blueprintId: node.loadsItemBlueprintId,
            itemName: itemName,
        };
        itemNodesList.push(nodeObject);
    }
    return itemNodesList;
}
function getMobNodesList(room, zone) {
    let mobNodesList = [];
    for (let node of room.mobNodes) {
        const mobName = zone.mobBlueprints.find(blueprint => { blueprint._id === node.loadsMobBlueprintId; })?.name;
        //TODO handle cases where the mob originates in another zone
        const nodeObject = {
            nodeId: node._id,
            blueprintId: node.loadsMobBlueprintId,
            mobName: mobName,
        };
        mobNodesList.push(nodeObject);
    }
    return mobNodesList;
}
export default edit;
