import { IUser } from "../model/classes/User.js";
import IRuntimeProps from "../types/RuntimeProps.js";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";

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
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`functionName`, error, agent.name);
  }
}

export default initRuntimePropsForAgent;
