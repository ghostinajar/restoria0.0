import worldEmitter from "../model/classes/WorldEmitter.js";
import makeMessage from "../types/makeMessage.js";
import getItemBlueprintListFromZone from "../util/getItemBlueprintListFromZone.js";
import getMobBlueprintListFromZone from "../util/getMobBlueprintListFromZone.js";
import getRoomOfUser from "../util/getRoomOfUser.js";
import getZoneOfUser from "../util/getZoneofUser.js";
async function erase(user) {
    const zone = await getZoneOfUser(user);
    const room = await getRoomOfUser(user);
    if (zone.author.toString() !== user._id.toString()) {
        worldEmitter.emit(`messageFor${user.username}`, makeMessage(`rejection`, `You aren't an author for this zone.`));
        return;
    }
    worldEmitter.emit(`formPromptFor${user.username}`, {
        form: `eraseForm`,
        itemBlueprintList: getItemBlueprintListFromZone(zone),
        mobBlueprintList: getMobBlueprintListFromZone(zone),
        //TODO implement getNextRoomListFromRoom (maybe refactor from create room?)
        //nextRoomList: getNextRoomListFromRoom(room)
        //TODO implement getUserList
        //userList: getUserListOfAuthor(user),
        //TODO implement getZoneListOfAuthor
        //zoneLIst: getZoneListOfAuthor(user)
    });
}
export default erase;
