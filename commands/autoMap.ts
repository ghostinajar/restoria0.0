// automap
// calls the map function only if user.preferences.autoMap === true

import { IUser } from "../model/classes/User.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import map from "./map.js";

async function automap(user: IUser) {
  try {
    if (!user.preferences.autoMap) {
      return;
    }
    map({commandWord: "map"}, user);
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`automap`, error, user?.name);
  }
}

export default automap;