import logger from "../logger";
function initiateRuntimePropsForUser(user) {
    try {
        const runtimeProps = {
            maxHp: user.calculateMaxHp(),
            currentHp: user.calculateMaxHp(),
            currentMp: user.calculateMaxMp(),
            maxMp: user.calculateMaxMp(),
            currentMv: user.calculateMaxMv(),
            maxMv: user.calculateMaxMv(),
        };
        user.runtimeProps = runtimeProps;
    }
    catch (err) {
        logger.error(`initiateRuntimeProps failed for user ${user.name}`);
    }
}
export default initiateRuntimePropsForUser;
