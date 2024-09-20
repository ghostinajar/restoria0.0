function getMobBlueprintListFromZone(zone) {
    const mobBlueprintList = zone.mobBlueprints.map((blueprint) => {
        return { id: blueprint._id, value: blueprint.name };
    });
    return mobBlueprintList;
}
export default getMobBlueprintListFromZone;
