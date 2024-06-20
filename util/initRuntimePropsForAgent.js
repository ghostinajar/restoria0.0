import logger from "../logger.js";
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
    catch (err) {
        logger.error(`initRuntimePropsForAgent failed in agent ${agent.name}`);
    }
}
export default initRuntimePropsForAgent;
