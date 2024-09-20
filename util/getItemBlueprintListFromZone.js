function getItemBlueprintListFromZone(zone) {
    const itemBlueprintList = zone.itemBlueprints.map((blueprint) => {
        return { id: blueprint._id, value: blueprint.name };
    });
    return itemBlueprintList;
}
export default getItemBlueprintListFromZone;
