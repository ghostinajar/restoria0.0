import worldEmitter from "../model/classes/WorldEmitter.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import getItemBlueprintNamesFromZone from "../util/getItemBlueprintNamesFromZone.js";
import getMobBlueprintNamesFromZone from "../util/getMobBlueprintNamesFromZone.js";
import getRoomNamesFromZone from "../util/getRoomNamesFromZone.js";
import getZoneOfUser from "../util/getZoneofUser.js";
import makeMessage from "../util/makeMessage.js";
import help from "./help.js";
async function suggestions(user) {
    try {
        const zone = await getZoneOfUser(user);
        if (!zone) {
            throw new Error(`Couldn't get ${user.username}'s zone.`);
        }
        if (zone.author.toString() !== user._id.toString()) {
            worldEmitter.emit(`messageFor${user.username}`, makeMessage("rejection", `You're not an author of this zone.`));
            return;
        }
        await filterInvalidSuggestionsFromZone(zone, user);
        await zone.save();
        await zone.initRooms();
        help({
            commandWord: "help",
            directObject: "suggestions",
        }, user);
        worldEmitter.emit(`formPromptFor${user.username}`, {
            form: `suggestionsForm`,
            suggestions: zone.suggestions,
            itemBlueprintNames: getItemBlueprintNamesFromZone(zone),
            mobBlueprintNames: getMobBlueprintNamesFromZone(zone),
            roomNames: getRoomNamesFromZone(zone),
        });
    }
    catch (error) {
        catchErrorHandlerForFunction("suggestions", error, user.name);
    }
}
// filterInvalidSuggestionsFromZone
async function filterInvalidSuggestionsFromZone(zone, user) {
    try {
        // Early return if no suggestions
        if (!zone.suggestions || !Array.isArray(zone.suggestions)) {
            return;
        }
        // Create Sets for quick lookups of valid IDs
        const validItemIds = new Set(zone.itemBlueprints?.map((item) => item._id.toString()) || []);
        const validMobIds = new Set(zone.mobBlueprints?.map((mob) => mob._id.toString()) || []);
        const validRoomIds = new Set(zone.rooms?.map((room) => room._id.toString()) || []);
        // Filter suggestions to only keep those with valid references
        zone.suggestions = zone.suggestions.filter((suggestion) => {
            // If suggestion doesn't have required properties, filter it out
            if (!suggestion.refersToObjectType || !suggestion.refersToId) {
                return false;
            }
            // Check if the referenced object exists based on type
            switch (suggestion.refersToObjectType) {
                case "item":
                    return validItemIds.has(suggestion.refersToId.toString());
                case "mob":
                    return validMobIds.has(suggestion.refersToId.toString());
                case "room":
                    return validRoomIds.has(suggestion.refersToId.toString());
                case "zone":
                    return true;
                default:
                    return false; // Filter out suggestions with invalid object types
            }
        });
    }
    catch (error) {
        catchErrorHandlerForFunction(`filterInvalidSuggestionsFromZone`, error, user?.name);
    }
}
export default suggestions;
