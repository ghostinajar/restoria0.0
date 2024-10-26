// deleteZoneById
import Zone from "../model/classes/Zone.js";
async function deleteZoneById(zoneId) {
    try {
        const result = await Zone.findByIdAndDelete(zoneId);
        if (result) {
            console.log(`Zone with _id: ${zoneId} was deleted.`);
        }
        else {
            console.log(`Zone with _id: ${zoneId} not found.`);
        }
    }
    catch (error) {
        console.error("Error deleting zone:", error);
        throw error;
    }
}
export default deleteZoneById;
