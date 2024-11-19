import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
function makeExitToRoomId(toRoomId, inZoneId) {
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
        catchErrorHandlerForFunction("makeExitToRoomId", error);
    }
}
export default makeExitToRoomId;
