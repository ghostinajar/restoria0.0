// getItemBlueprintNamesFromZone
import { IZone } from "../model/classes/Zone.js";

function getItemBlueprintNamesFromZone(zone: IZone) {
  const itemBlueprintNames = zone.itemBlueprints.map((blueprint) => {
    return { _id: blueprint._id, name: blueprint.name };
  });
  return itemBlueprintNames;
}

export default getItemBlueprintNamesFromZone