// suggest
// allows user to leave a writing suggestion for the author of a room/item/mob
import mongoose from "mongoose";
import User from "../model/classes/User.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import getItemBlueprintNamesFromZone from "../util/getItemBlueprintNamesFromZone.js";
import getMobBlueprintNamesFromZone from "../util/getMobBlueprintNamesFromZone.js";
import getRoomOfUser from "../util/getRoomOfUser.js";
import getZoneOfUser from "../util/getZoneofUser.js";
import makeMessage from "../util/makeMessage.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import help from "./help.js";
async function suggest(parsedCommand, user) {
    try {
        let target = parsedCommand.directObject;
        if (!target || !["item", "mob", "room", "zone"].includes(target)) {
            rejectSuggest(user);
            return;
        }
        const zone = await getZoneOfUser(user);
        if (!zone) {
            throw new Error(`Zone not found for user ${user.name}`);
        }
        const zoneAuthor = await User.findById(zone.author);
        if (!zoneAuthor) {
            throw new Error(`Author of ${zone.name} (user with id ${zone.author.toString()} doesn't exist!(?)`);
        }
        // reject suggestions from users who aren't the editor or author
        if (zoneAuthor.editor?.toString() != user._id.toString() &&
            zone.author.toString() != user._id.toString()) {
            worldEmitter.emit(`messageFor${user.username}`, makeMessage("rejection", `If you want to suggest in this zone, ask its author to make you an editor.`));
            return;
        }
        help({
            commandWord: "help",
            directObject: "suggest",
        }, user);
        const room = await getRoomOfUser(user);
        if (!room) {
            throw new Error(`Room not found for user ${user.name}'s location.`);
        }
        const formPromptData = {
            form: `suggestForm`,
            refersToObjectType: target,
            names: [
                { _id: new mongoose.Types.ObjectId(), name: "(current location)" },
            ],
            defaultOption: "",
        };
        // prepare formPromptData with list of object names, and default to show
        // the first item or mob visible in the room, for convenience
        switch (target) {
            case `item`:
                let itemBlueprintNames = getItemBlueprintNamesFromZone(zone);
                if (itemBlueprintNames) {
                    formPromptData.names = itemBlueprintNames;
                }
                formPromptData.defaultOption =
                    room.itemNodes[0]?.loadsBlueprintId?.toString();
                break;
            case `mob`:
                let mobBlueprintNames = getMobBlueprintNamesFromZone(zone);
                if (mobBlueprintNames) {
                    formPromptData.names = mobBlueprintNames;
                }
                formPromptData.defaultOption =
                    room.mobNodes[0]?.loadsBlueprintId?.toString();
                break;
            case `room`:
            case `zone`:
                break;
            default: {
                rejectSuggest(user);
                return;
            }
        }
        worldEmitter.emit(`formPromptFor${user.username}`, formPromptData);
    }
    catch (error) {
        catchErrorHandlerForFunction("suggest", error, user.name);
    }
}
function rejectSuggest(user) {
    worldEmitter.emit(`messageFor${user.username}`, makeMessage(`rejection`, `What is your suggestion for? Try SUGGEST ITEM, SUGGEST MOB, SUGGEST ROOM, or SUGGEST ZONE`));
}
export default suggest;
