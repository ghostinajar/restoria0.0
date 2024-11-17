// deleteZoneById
import Zone from "../model/classes/Zone.js";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";

async function deleteZoneById(zoneId: string): Promise<void> {
  try {
    const result = await Zone.findByIdAndDelete(zoneId);
    if (result) {
      console.log(`Zone with _id: ${zoneId} was deleted.`);
    } else {
      console.log(`Zone with _id: ${zoneId} not found.`);
    }
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`deleteZoneById`, error);
  }
}

export default deleteZoneById;
