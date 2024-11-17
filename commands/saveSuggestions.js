import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
async function saveSuggestions(suggestions, zone) {
    try {
        zone.suggestions = suggestions;
        await zone.save();
        zone.initRooms();
    }
    catch (error) {
        catchErrorHandlerForFunction("saveSuggestions", error);
    }
}
export default saveSuggestions;
