import mongoose from "mongoose";
import worldEmitter from "../model/classes/WorldEmitter.js";
import getItemBlueprintNamesFromZone from "../util/getItemBlueprintNamesFromZone.js";
import getMobBlueprintNamesFromZone from "../util/getMobBlueprintNamesFromZone.js";
import getRoomOfUser from "../util/getRoomOfUser.js";
import getZoneOfUser from "../util/getZoneofUser.js";
import makeMessage from "../util/makeMessage.js";
async function suggest(parsedCommand, user) {
    let target = parsedCommand.directObject;
    const zone = await getZoneOfUser(user);
    const room = await getRoomOfUser(user);
    if (!target) {
        rejectSuggest(user);
        return;
    }
    const formData = {
        form: `suggestForm`,
        refersToObjectType: target,
        names: [{ _id: new mongoose.Types.ObjectId(), name: "(current location)" }],
        defaultOption: "",
    };
    switch (target) {
        case `item`:
            formData.refersToObjectType = 'itemBlueprint';
            formData.names = getItemBlueprintNamesFromZone(zone);
            formData.defaultOption = room.itemNodes[0].loadsBlueprintId.toString();
            break;
        case `mob`:
            formData.refersToObjectType = 'mobBlueprint';
            formData.names = getMobBlueprintNamesFromZone(zone);
            formData.defaultOption = room.mobNodes[0].loadsBlueprintId.toString();
            break;
        case `room`:
        case `zone`:
            break;
        default: {
            rejectSuggest(user);
            return;
        }
    }
    worldEmitter.emit(`formPromptFor${user.username}`, formData);
}
function rejectSuggest(user) {
    worldEmitter.emit(`messageFor${user.username}`, makeMessage(`rejection`, `What is your suggestion for? Try SUGGEST ITEM, SUGGEST MOB, SUGGEST ROOM, or SUGGEST ZONE`));
}
export default suggest;
