// goto
// allows user to transport to any room in a zone they are building or editing
import User, { IUser } from "../model/classes/User.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import getZonesNamesByAuthorId from "../util/getZoneNamesByAuthorId.js";
import makeMessage from "../util/makeMessage.js";

async function goto(user: IUser) {
  try {
    let zonesNames = await getZonesNamesByAuthorId(user._id.toString());
    const usersWithThisEditor = await User.find({ editor: user._id });

    // await promise array for the zones of each otherUser
    const userZoneNamesPromises = usersWithThisEditor.map((otherUser) =>
      getZonesNamesByAuthorId(otherUser._id.toString())
    );
    const userZoneNamesArray = await Promise.all(userZoneNamesPromises);
    // add arrays from resolved promises to zonesNames
    userZoneNamesArray.forEach((userZoneNames) => {
      zonesNames = [...zonesNames, ...userZoneNames];
    });

    if (zonesNames.length === 0) {
      worldEmitter.emit(
        `messageFor${user.username}`,
        makeMessage(
          "rejection",
          `It seems you aren't the author or editor of any zones. Try CREATE ZONE`
        )
      );
      return;
    }

    worldEmitter.emit(`formPromptFor${user.username}`, {
      form: `gotoForm`,
      zoneNames: zonesNames,
    });
  } catch (error: unknown) {
    catchErrorHandlerForFunction("goto", error, user.name)
  }
}
export default goto;
