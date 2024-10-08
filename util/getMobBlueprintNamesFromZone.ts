// getMobBlueprintNamesFromZone
import { IZone } from "../model/classes/Zone.js";

function getMobBlueprintNamesFromZone(zone: IZone) {
  const mobBlueprintNames = zone.mobBlueprints.map((blueprint) => {
    return { _id: blueprint._id, name: blueprint.name };
  });
  return mobBlueprintNames;
}

export default getMobBlueprintNamesFromZone