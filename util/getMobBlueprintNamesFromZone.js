import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
function getMobBlueprintNamesFromZone(zone) {
    try {
        const mobBlueprintNames = zone.mobBlueprints.map((blueprint) => {
            return { _id: blueprint._id, name: blueprint.name };
        });
        return mobBlueprintNames;
    }
    catch (error) {
        catchErrorHandlerForFunction("getMobBlueprintNamesFromZone", error);
    }
}
export default getMobBlueprintNamesFromZone;
