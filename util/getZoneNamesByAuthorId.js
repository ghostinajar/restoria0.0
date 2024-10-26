// getZoneNamesByAuthorId
import Zone from "../model/classes/Zone.js";
async function getZoneNamesByAuthorId(authorId) {
    try {
        // const start = performance.now(); // Start time
        const zones = await Zone.find({ author: authorId })
            .select("name _id rooms")
            .populate({
            path: "rooms",
            select: "name _id",
        })
            .lean();
        // const query = performance.now(); // Query time
        // console.log(`Query time: ${query - start} ms`);
        // const end = performance.now(); // End time
        // console.log(`Map time: ${end - query} ms`);
        return zones.map((zone) => ({
            name: zone.name,
            _id: zone._id.toString(),
            roomNames: zone.rooms.map((room) => ({
                name: room.name,
                _id: room._id.toString(),
            })),
        }));
    }
    catch (err) {
        console.error("Error fetching zones by author:", err);
        throw err;
    }
}
export default getZoneNamesByAuthorId;
