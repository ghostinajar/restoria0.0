import { ISuggestion } from "../model/classes/Suggestion.js";
import { IZone } from "../model/classes/Zone.js";

async function saveSuggestions(suggestions: Array<ISuggestion>, zone: IZone) {
  console.log(zone.name)
  console.log(suggestions)
  zone.suggestions = suggestions;
  await zone.save();
  zone.initRooms();
}

export default saveSuggestions;