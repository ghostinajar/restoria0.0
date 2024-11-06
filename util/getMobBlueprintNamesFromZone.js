function getMobBlueprintNamesFromZone(zone) {
    const mobBlueprintNames = zone.mobBlueprints.map((blueprint) => {
        return { _id: blueprint._id, name: blueprint.name };
    });
    return mobBlueprintNames;
}
export default getMobBlueprintNamesFromZone;
