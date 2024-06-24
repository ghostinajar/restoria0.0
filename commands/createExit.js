function createExit(toRoomId, inZoneId) {
    const newExit = {
        destinationLocation: {
            inZone: inZoneId,
            inRoom: toRoomId,
        },
        toExternalZone: false,
        isHidden: false,
        isClosed: false,
        isLocked: false,
    };
    return newExit;
}
;
export default createExit;
