// goto
// allows user to transport to any room in a zone they are building or editing

import logger from "../logger.js";
import User, { IUser } from "../model/classes/User.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import getZonesNamesByAuthorId from "../util/getZoneNamesByAuthorId.js";
import makeMessage from "../util/makeMessage.js";

async function goto(user: IUser) {
  try {
    let zonesNames = await getZonesNamesByAuthorId(user._id.toString());
    console.log("zonesNames before adding editor zones");
    console.log(zonesNames);

    const usersWithThisEditor = await User.find({ editor: user._id });
    console.log("names of users with this editor:");
    console.log(
      usersWithThisEditor.map((user) => {
        return user.name;
      })
    );

    // await promise array for the zones of each otherUser
    const userZoneNamesPromises = usersWithThisEditor.map((otherUser) =>
      getZonesNamesByAuthorId(otherUser._id.toString())
    );
    const userZoneNamesArray = await Promise.all(userZoneNamesPromises);
    // add arrays from resolved promises to zonesNames
    userZoneNamesArray.forEach((userZoneNames) => {
      console.log("userZoneNames to add:");
      console.log(userZoneNames);
      zonesNames = [...zonesNames, ...userZoneNames];
    });

    console.log("zonesNames after adding editor zones");
    console.log(zonesNames);

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
    worldEmitter.emit(
      `messageFor${user.username}`,
      makeMessage(
        "rejection",
        `There was an error on our server. Ralu will have a look at it soon!`
      )
    );
    if (error instanceof Error) {
      logger.error("editor command encountered an error:", error.message);
    } else {
      logger.error("editor command encountered an unknown error:", error);
    }
  }
}
export default goto;
