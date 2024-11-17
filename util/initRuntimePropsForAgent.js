import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
function initRuntimePropsForAgent(agent) {
    try {
        const runtimeProps = {
            maxHp: agent.calculateMaxHp(),
            currentHp: agent.calculateMaxHp(),
            currentMp: agent.calculateMaxMp(),
            maxMp: agent.calculateMaxMp(),
            currentMv: agent.calculateMaxMv(),
            maxMv: agent.calculateMaxMv(),
        };
        agent.runtimeProps = runtimeProps;
    }
    catch (error) {
        catchErrorHandlerForFunction(`functionName`, error, agent.name);
    }
}
export default initRuntimePropsForAgent;
