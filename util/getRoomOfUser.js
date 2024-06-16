import worldEmitter from "../model/classes/WorldEmitter.js";
async function getRoomOfUser(user) {
    const room = await new Promise((resolve) => {
        worldEmitter.once(`zoneManagerReturningRoom${user.location.inRoom.toString()}`, resolve);
        worldEmitter.emit("roomRequested", user.location);
    });
    return room;
}
export default getRoomOfUser;
