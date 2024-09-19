import { IZone } from "../model/classes/Zone.js";

function getItemBlueprintListFromZone(zone: IZone) {
  const itemBlueprintList = zone.itemBlueprints.map((blueprint) => {
    return { id: blueprint._id, value: blueprint.name };
  });
  return itemBlueprintList;
}

export default getItemBlueprintListFromZone