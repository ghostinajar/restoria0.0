import { IUser } from "../model/classes/User.js";
import IAgentRuntimeProps from "../types/AgentRuntimeProps.js";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";

function initRuntimePropsForAgent(agent: IUser) {
  try {
    const runtimeProps: IAgentRuntimeProps = {
      maxHp: agent.calculateMaxHp(),
      currentHp: agent.calculateMaxHp(),
      currentMp: agent.calculateMaxMp(),
      maxMp: agent.calculateMaxMp(),
      currentMv: agent.calculateMaxMv(),
      maxMv: agent.calculateMaxMv(),
    };
    agent.runtimeProps = runtimeProps;
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`initRuntimePropsForAgent`, error, agent.name);
  }
}

export default initRuntimePropsForAgent;
