function getItemBlueprintNamesFromZone(zone) {
    const itemBlueprintNames = zone.itemBlueprints.map((blueprint) => {
        return { _id: blueprint._id, name: blueprint.name };
    });
    return itemBlueprintNames;
}
export default getItemBlueprintNamesFromZone;
