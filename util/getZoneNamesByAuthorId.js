import Zone from "../model/classes/Zone.js";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
async function getZoneNamesByAuthorId(authorId) {
    try {
        const query = authorId ? { author: authorId } : {};
        const zones = await Zone.find(query)
            .select("name _id rooms")
            .populate({
            path: "rooms",
            select: "name _id",
        })
            .lean();
        return (zones.map((zone) => ({
            name: zone.name,
            _id: zone._id.toString(),
            roomNames: zone.rooms.map((room) => ({
                name: room.name,
                _id: room._id.toString(),
            })),
        })) || []);
    }
    catch (error) {
        catchErrorHandlerForFunction(`getZoneNamesByAuthorId`, error);
        return [];
    }
}
export default getZoneNamesByAuthorId;
