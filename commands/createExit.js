import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
function createExit(toRoomId, inZoneId, user) {
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
        catchErrorHandlerForFunction("createExit", error);
    }
}
export default createExit;
