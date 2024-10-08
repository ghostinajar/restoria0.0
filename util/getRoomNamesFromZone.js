async function getRoomNamesFromZone(zone) {
    const roomNames = zone.rooms.map((room) => {
        return { _id: room._id, name: room.name };
    });
    return roomNames;
}
export default getRoomNamesFromZone;
