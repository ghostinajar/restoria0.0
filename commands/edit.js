import worldEmitter from "../model/classes/WorldEmitter.js";
import makeMessage from "../types/makeMessage.js";
import getRoomOfUser from "../util/getRoomOfUser.js";
import getZoneOfUser from "../util/getZoneofUser.js";
async function edit(parsedCommand, user) {
    let target = parsedCommand.directObject;
    if (!target) {
        worldEmitter.emit(`messageFor${user.username}`, makeMessage(`rejection`, `Edit what?`));
        return;
    }
    switch (target) {
        case `item`: {
            const zone = await getZoneOfUser(user);
            const itemBlueprintList = zone.itemBlueprints.map(blueprint => { return { "id": blueprint._id, "value": blueprint.name }; });
            worldEmitter.emit(`formPromptFor${user.username}`, { form: `editItemSelect`, list: itemBlueprintList });
            break;
        }
        case `mob`: {
            const zone = await getZoneOfUser(user);
            const mobBlueprintList = zone.mobBlueprints.map(blueprint => { return { "id": blueprint._id, "value": blueprint.name }; });
            worldEmitter.emit(`formPromptFor${user.username}`, { form: `editMobSelect`, list: mobBlueprintList });
            break;
        }
        case `room`: {
            const room = await getRoomOfUser(user);
            worldEmitter.emit(`formPromptFor${user.username}`, {
                form: `editRoomForm`,
                name: room.name,
                isDark: room.isDark,
                isIndoors: room.isIndoors,
                isOnWater: room.isOnWater,
                isUnderwater: room.isUnderwater,
                noMounts: room.noMounts,
                noMobs: room.noMobs,
                noMagic: room.noMagic,
                noCombat: room.noCombat,
                examine: room.description.examine,
                study: room.description.study,
                research: room.description.research,
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
export default edit;
