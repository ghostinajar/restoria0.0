import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
function getItemBlueprintNamesFromZone(zone) {
    try {
        const itemBlueprintNames = zone.itemBlueprints.map((blueprint) => {
            return { _id: blueprint._id, name: blueprint.name };
        });
        return itemBlueprintNames;
    }
    catch (error) {
        catchErrorHandlerForFunction("functionName", error);
    }
}
export default getItemBlueprintNamesFromZone;
