import worldEmitter from "../model/classes/WorldEmitter.js";
import makeMessage from "../util/makeMessage.js";
import getItemBlueprintNamesFromZone from "../util/getItemBlueprintNamesFromZone.js";
import getMobBlueprintNamesFromZone from "../util/getMobBlueprintNamesFromZone.js";
import getRoomOfUser from "../util/getRoomOfUser.js";
import getZoneOfUser from "../util/getZoneofUser.js";
import { spells } from "../constants/SPELL.js";
import { itemTypes } from "../constants/ITEM_TYPE.js";
import { affixTypes } from "../constants/AFFIX_TYPE.js";
import { damageTypes } from "../constants/DAMAGE_TYPE.js";
import userHasZoneAuthorId from "../util/userHasZoneAuthorId.js";
import getRoomNamesFromZone from "../util/getRoomNamesFromZone.js";
import getNameById from "../util/getNameById.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import HELP from "../constants/HELP.js";
import help from "./help.js";
async function edit(parsedCommand, user) {
    try {
        let target = parsedCommand.directObject;
        const zone = await getZoneOfUser(user);
        if (!zone) {
            throw new Error(`Couldn't get ${user.username}'s zone.`);
        }
        if (!target) {
            worldEmitter.emit(`messageFor${user.username}`, makeMessage(`rejection`, `Edit what? Try EDIT ITEM, EDIT MOB, EDIT ROOM, EDIT USER, or EDIT ZONE.`));
            return;
        }
        if (target !== "user" && target !== "character") {
            if (!userHasZoneAuthorId(zone.author.toString(), user)) {
                return;
            }
        }
        switch (target) {
            case `object`:
                worldEmitter.emit(`messageFor${user.username}`, makeMessage(`help`, `Objects are called items in Restoria.`));
            case `item`: {
                worldEmitter.emit(`formPromptFor${user.username}`, {
                    form: `editItemBlueprintForm`,
                    itemBlueprintNames: getItemBlueprintNamesFromZone(zone),
                    itemBlueprintFullData: zone.itemBlueprints,
                    spells: spells,
                    itemTypes: itemTypes,
                    affixTypes: affixTypes,
                    damageTypes: damageTypes,
                    editItemGeneralHelp: HELP.EDIT_ITEM,
                    editItemDescriptionHelp: HELP.DESCRIPTION,
                    editItemTagsHelp: HELP.ITEM_TAG,
                    editItemItemNodesHelp: HELP.ITEM_NODE,
                    editItemAffixesHelp: HELP.AFFIX,
                    editItemWeaponHelp: HELP.WEAPON_PROPERTIES,
                    editItemArmorHelp: HELP.ARMOR,
                    editItemSpellHelp: HELP.ITEM_SPELL_PROPERTIES,
                });
                break;
            }
            case `monster`:
            case `npc`:
                worldEmitter.emit(`messageFor${user.username}`, makeMessage(`help`, `Monsters and NPCs are considered mobs in Restoria.`));
            case `mob`: {
                const zone = await getZoneOfUser(user);
                if (!zone) {
                    throw new Error(`Couldn't get ${user.username}'s zone.`);
                }
                worldEmitter.emit(`formPromptFor${user.username}`, {
                    form: `editMobBlueprintForm`,
                    mobBlueprintNames: getMobBlueprintNamesFromZone(zone),
                    mobBlueprintFullData: zone.mobBlueprints,
                    itemBlueprintNames: getItemBlueprintNamesFromZone(zone),
                    affixTypes: affixTypes,
                    editMobGeneralHelp: HELP.EDIT_MOB,
                    editMobDescriptionHelp: HELP.DESCRIPTION,
                    editMobItemNodesHelp: HELP.ITEM_NODE,
                    editMobAffixesHelp: HELP.AFFIX,
                });
                break;
            }
            case `room`: {
                const room = await getRoomOfUser(user);
                if (!room) {
                    throw new Error(`room not found for user ${user.name}`);
                }
                const itemBlueprintNames = getItemBlueprintNamesFromZone(zone);
                const mobBlueprintNames = getMobBlueprintNamesFromZone(zone);
                const itemNodes = getItemNodesFromRoom(room, zone);
                const mobNodes = getMobNodesFromRoom(room, zone);
                const roomList = getRoomNamesFromZone(zone);
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
                        mobNodes: mobNodes,
                        itemNodes: itemNodes,
                        exits: room.exits,
                        playerCap: room.playerCap,
                        mobCap: room.mobCap,
                    },
                    zoneData: {
                        itemBlueprintNames: itemBlueprintNames,
                        mobBlueprintNames: mobBlueprintNames,
                        rooms: roomList,
                    },
                    editRoomDescriptionHelp: HELP.DESCRIPTION,
                    editRoomTagsHelp: HELP.EDIT_ROOM_TAGS,
                    editRoomExitsHelp: HELP.EXITS,
                    editRoomItemNodesHelp: HELP.ITEM_NODE,
                    editRoomMobNodesHelp: HELP.MOB_NODE,
                });
                break;
            }
            case `character`:
            case `user`: {
                help({
                    commandWord: "help",
                    directObject: "edit_user",
                }, user);
                worldEmitter.emit(`formPromptFor${user.username}`, {
                    form: `editUserForm`,
                    examine: user.description.examine,
                    study: user.description.study,
                    research: user.description.research,
                });
                break;
            }
            case `zone`: {
                help({
                    commandWord: "help",
                    directObject: "edit_zone",
                }, user);
                const zone = await getZoneOfUser(user);
                if (!zone) {
                    throw new Error(`Couldn't get ${user.username}'s zone.`);
                }
                worldEmitter.emit(`formPromptFor${user.username}`, {
                    form: `editZoneForm`,
                    zoneId: zone._id,
                    name: zone.name,
                    minutesToRespawn: zone.minutesToRespawn,
                    description: zone.description,
                });
                break;
            }
            default: {
                worldEmitter.emit(`messageFor${user.username}`, makeMessage(`rejection`, `Edit what? Try EDIT ITEM, EDIT MOB, EDIT ROOM, EDIT USER, or EDIT ZONE.`));
                return;
            }
        }
    }
    catch (error) {
        catchErrorHandlerForFunction("edit", error, user.name);
    }
}
function getItemNodesFromRoom(room, zone) {
    try {
        let itemNodesList = [];
        for (let node of room.itemNodes) {
            const itemName = getNameById(zone.itemBlueprints, node.loadsBlueprintId.toString());
            //TODO handle cases where the item originates in another zone?
            const nodeObject = {
                _id: node._id,
                loadsBlueprintId: node.loadsBlueprintId,
                name: itemName || "",
            };
            itemNodesList.push(nodeObject);
        }
        return itemNodesList;
    }
    catch (error) {
        catchErrorHandlerForFunction("getItemNodesFromRoom", error);
    }
}
function getMobNodesFromRoom(room, zone) {
    try {
        let mobNodesList = [];
        for (let node of room.mobNodes) {
            const mobName = getNameById(zone.mobBlueprints, node.loadsBlueprintId.toString());
            //TODO handle cases where the mob originates in another zone
            const nodeObject = {
                _id: node._id,
                loadsBlueprintId: node.loadsBlueprintId,
                name: mobName || "",
            };
            mobNodesList.push(nodeObject);
        }
        return mobNodesList;
    }
    catch (error) {
        catchErrorHandlerForFunction("getMobNodesFromRoom", error);
    }
}
export default edit;
