// deleteZoneById
import logger from "../logger.js";
import Zone from "../model/classes/Zone.js";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
async function deleteZoneById(zoneId) {
    try {
        const result = await Zone.findByIdAndDelete(zoneId);
        if (!result) {
            throw new Error(`Zone with _id: ${zoneId} not found.`);
        }
        logger.info(`Zone with _id: ${zoneId} was deleted.`);
    }
    catch (error) {
        catchErrorHandlerForFunction(`deleteZoneById`, error);
    }
}
export default deleteZoneById;
