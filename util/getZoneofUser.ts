import { IUser } from "../model/classes/User.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import { IZone } from "../model/classes/Zone.js";

async function getZoneOfUser(user: IUser) {
  const zone: IZone = await new Promise ((resolve)=>{
    worldEmitter.once(`zone${user.location.inZone.toString()}Loaded`, resolve);
    worldEmitter.emit(`zoneRequested`, user.location.inZone);
  });
  return zone;
}

export default getZoneOfUser;
