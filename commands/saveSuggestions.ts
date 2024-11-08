// saveSuggestions
// saves changes to suggestions from a user suggestions form submission
import logger from "../logger.js";
import { ISuggestion } from "../model/classes/Suggestion.js";
import { IZone } from "../model/classes/Zone.js";

async function saveSuggestions(suggestions: Array<ISuggestion>, zone: IZone) {
  try {
    zone.suggestions = suggestions;
    await zone.save();
    zone.initRooms();
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(`server error for zone ${zone.name}: ${error.message}`);
    } else {
      logger.error(`server error for zone ${zone.name}: ${error}`);
    }
  }
}

export default saveSuggestions;
