// saveSuggestions
// saves changes to suggestions from a user suggestions form submission
import { ISuggestion } from "../model/classes/Suggestion.js";
import { IZone } from "../model/classes/Zone.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";

async function saveSuggestions(suggestions: Array<ISuggestion>, zone: IZone) {
  try {
    zone.suggestions = suggestions;
    await zone.save();
    zone.initRooms();
  } catch (error: unknown) {
    catchErrorHandlerForFunction("saveSuggestions", error)

  }
}

export default saveSuggestions;
