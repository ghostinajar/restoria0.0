import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
function makeExitToRoomId(toRoomId, inZoneId) {
    try {
        const newExit = {
            destinationLocation: {
                inZone: inZoneId,
                inRoom: toRoomId,
            },
            toExternalZone: false,
            hiddenByDefault: false,
            closedByDefault: false,
            isClosed: false,
            isLocked: false,
        };
        return newExit;
    }
    catch (error) {
        catchErrorHandlerForFunction("makeExitToRoomId", error);
    }
}
export default makeExitToRoomId;
