import { IUser } from "../model/classes/User";
import logger from "../logger";
import IRuntimeProps from "../types/RuntimeProps";

function initiateRuntimePropsForUser(user: IUser) {
  try {
    const runtimeProps: IRuntimeProps = {
      maxHp: user.calculateMaxHp(),
      currentHp: user.calculateMaxHp(),
      currentMp: user.calculateMaxMp(),
      maxMp: user.calculateMaxMp(),
      currentMv: user.calculateMaxMv(),
      maxMv: user.calculateMaxMv(),
    };
    user.runtimeProps = runtimeProps;
  } catch (err) {
    logger.error(`initiateRuntimeProps failed for user ${user.name}`);
  }
}

export default initiateRuntimePropsForUser;
