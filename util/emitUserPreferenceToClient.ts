// emitUserPreferenceToClient
// use after changing a user preferece to message the change to that client

import { IUser } from "../model/classes/User.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";

async function emitUserPreferenceToClient(
  user: IUser,
  preferenceType: string,
  setting: any
) {
  try {
    worldEmitter.emit(`preferenceFor${user.username}`, {
      type: preferenceType,
      setting: setting,
    });
  } catch (error: unknown) {
    catchErrorHandlerForFunction(
      `emitUserPreferenceToClient`,
      error,
      user?.name
    );
  }
}

export default emitUserPreferenceToClient;
