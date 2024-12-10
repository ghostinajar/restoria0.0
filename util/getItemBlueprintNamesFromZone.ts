// getItemBlueprintNamesFromZone
import { IZone } from "../model/classes/Zone.js";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";

function getItemBlueprintNamesFromZone(zone: IZone) {
  try {
    const itemBlueprintNames = zone.itemBlueprints.map((blueprint) => {
      return { _id: blueprint._id, name: blueprint.name };
    });
    
    return itemBlueprintNames;
  } catch (error: unknown) {
    catchErrorHandlerForFunction("getItemBlueprintNamesFromZone", error);
  }
}

export default getItemBlueprintNamesFromZone;
