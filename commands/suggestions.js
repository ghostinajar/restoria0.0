import worldEmitter from "../model/classes/WorldEmitter.js";
import getZoneOfUser from "../util/getZoneofUser.js";
async function suggestions(user) {
    const zone = await getZoneOfUser(user);
    worldEmitter.emit(`formPromptFor${user.username}`, {
        form: `suggestionsList`,
        suggestions: zone.suggestions
    });
}
export default suggestions;
