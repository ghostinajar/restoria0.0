// filterInvalidSuggestionsFromZone
// removes all suggestions in a given zone which point to non-existent ids, etc.

import { IZone } from "../model/classes/Zone.js";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";

async function filterInvalidSuggestionsFromZone(zone: IZone) {
  try {
    // Early return if no suggestions
  if (!zone.suggestions || !Array.isArray(zone.suggestions)) {
    return zone;
  }

  // Create Sets for quick lookups of valid IDs
  const validItemIds = new Set(zone.itemBlueprints?.map(item => item._id) || []);
  const validMobIds = new Set(zone.mobBlueprints?.map(mob => mob._id) || []);
  const validRoomIds = new Set(zone.rooms?.map(room => room._id) || []);

  // Filter suggestions to only keep those with valid references
  zone.suggestions = zone.suggestions.filter(suggestion => {
    // If suggestion doesn't have required properties, filter it out
    if (!suggestion.refersToObjectType || !suggestion.refersToId) {
      return false;
    }

    // Check if the referenced object exists based on type
    switch (suggestion.refersToObjectType) {
      case 'itemBlueprint':
        return validItemIds.has(suggestion.refersToId);
      case 'mobBlueprint':
        return validMobIds.has(suggestion.refersToId);
      case 'room':
        return validRoomIds.has(suggestion.refersToId);
      default:
        return false; // Filter out suggestions with invalid object types
    }
  });

  await zone.save();
  return zone;
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`filterInvalidSuggestionsFromZone`, error);
  }
}

export default filterInvalidSuggestionsFromZone;