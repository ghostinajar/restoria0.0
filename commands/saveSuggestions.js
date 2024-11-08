// saveSuggestions
// saves changes to suggestions from a user suggestions form submission
import logger from "../logger.js";
async function saveSuggestions(suggestions, zone) {
    try {
        zone.suggestions = suggestions;
        await zone.save();
        zone.initRooms();
    }
    catch (error) {
        if (error instanceof Error) {
            logger.error(`server error for zone ${zone.name}: ${error.message}`);
        }
        else {
            logger.error(`server error for zone ${zone.name}: ${error}`);
        }
    }
}
export default saveSuggestions;
