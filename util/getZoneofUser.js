import worldEmitter from "../model/classes/WorldEmitter.js";
async function getZoneOfUser(user) {
    const zone = await new Promise((resolve) => {
        worldEmitter.once(`zone${user.location.inZone.toString()}Loaded`, resolve);
        worldEmitter.emit(`zoneRequested`, user.location.inZone);
    });
    return zone;
}
export default getZoneOfUser;
