// suggestions
// shows author the list of suggestions for the zone they're in
import logger from "../logger.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import getItemBlueprintNamesFromZone from "../util/getItemBlueprintNamesFromZone.js";
import getMobBlueprintNamesFromZone from "../util/getMobBlueprintNamesFromZone.js";
import getRoomNamesFromZone from "../util/getRoomNamesFromZone.js";
import getZoneOfUser from "../util/getZoneofUser.js";
import makeMessage from "../util/makeMessage.js";
async function suggestions(user) {
    try {
        const zone = await getZoneOfUser(user);
        worldEmitter.emit(`formPromptFor${user.username}`, {
            form: `suggestionsForm`,
            suggestions: zone.suggestions,
            itemBlueprintNames: getItemBlueprintNamesFromZone(zone),
            mobBlueprintNames: getMobBlueprintNamesFromZone(zone),
            roomNames: getRoomNamesFromZone(zone),
        });
    }
    catch (error) {
        worldEmitter.emit(`messageFor${user.username}`, makeMessage("rejection", `There was an error on our server. Ralu will have a look at it soon!`));
        if (error instanceof Error) {
            logger.error(`suggestions error for user ${user.username}: ${error.message}`);
        }
        else {
            logger.error(`suggestions error for user ${user.username}: ${error}`);
        }
    }
}
export default suggestions;
