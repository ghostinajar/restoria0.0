// createExit
// used by createRoom (createRoom will catch and handle error)
function createExit(toRoomId, inZoneId) {
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
;
export default createExit;
