// getMobBlueprintNamesFromZone
import { IZone } from "../model/classes/Zone.js";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";

function getMobBlueprintNamesFromZone(zone: IZone) {
  try {
  const mobBlueprintNames = zone.mobBlueprints.map((blueprint) => {
    return { _id: blueprint._id, name: blueprint.name };
  });
  return mobBlueprintNames;
  } catch (error: unknown) {
    catchErrorHandlerForFunction("functionName", error);
  }
  
}

export default getMobBlueprintNamesFromZone