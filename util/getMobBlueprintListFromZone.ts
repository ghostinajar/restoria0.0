import { IZone } from "../model/classes/Zone.js";

function getMobBlueprintListFromZone(zone: IZone) {
  const mobBlueprintList = zone.mobBlueprints.map((blueprint) => {
    return { id: blueprint._id, value: blueprint.name };
  });
  return mobBlueprintList;
}

export default getMobBlueprintListFromZone