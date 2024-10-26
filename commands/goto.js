import worldEmitter from "../model/classes/WorldEmitter.js";
import getZonesNamesByAuthorId from "../util/getZoneNamesByAuthorId.js";
async function goto(user) {
    const zonesNames = await getZonesNamesByAuthorId(user._id.toString());
    worldEmitter.emit(`formPromptFor${user.username}`, {
        form: `gotoForm`,
        zoneNames: zonesNames,
    });
}
export default goto;
