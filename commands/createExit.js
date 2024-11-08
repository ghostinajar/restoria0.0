import logger from "../logger.js";
function createExit(toRoomId, inZoneId) {
    try {
        const newExit = {
            destinationLocation: {
                inZone: inZoneId,
                inRoom: toRoomId,
            },
            toExternalZone: false,
            isHidden: false,
            isClosed: false,
        };
        return newExit;
    }
    catch (error) {
        if (error instanceof Error) {
            logger.error(`createExit error: ${error.message}`);
        }
        else {
            logger.error(`createExit error: ${error}`);
        }
    }
}
export default createExit;
