import { IUser } from "../model/classes/User.js";
import logger from "../logger.js";
import IRuntimeProps from "../types/RuntimeProps.js";

function initRuntimePropsForAgent(agent: IUser) {
  try {
    const runtimeProps: IRuntimeProps = {
      maxHp: agent.calculateMaxHp(),
      currentHp: agent.calculateMaxHp(),
      currentMp: agent.calculateMaxMp(),
      maxMp: agent.calculateMaxMp(),
      currentMv: agent.calculateMaxMv(),
      maxMv: agent.calculateMaxMv(),
    };
    agent.runtimeProps = runtimeProps;
  } catch (err) {
    logger.error(`initRuntimePropsForAgent failed in agent ${agent.name}`);
  }
}

export default initRuntimePropsForAgent;
