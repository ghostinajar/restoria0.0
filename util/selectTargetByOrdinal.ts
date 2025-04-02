// selectTargetByOrdinal
// takes an ordinal, keyword, and array, and returns the correct target
import { IItem } from "../model/classes/Item.js";
import { IMob } from "../model/classes/Mob.js";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";

function selectTargetByOrdinal(
  ordinal: number,
  keyword: string,
  array: Array<IItem | IMob>,
): IItem | IMob | undefined {
  try {
    const filteredArray = array.filter((object) =>
      object.keywords.some((key) => key.startsWith(keyword))
    );
    return filteredArray[ordinal];
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`selectTargetByOrdinal`, error);
  }
}

export default selectTargetByOrdinal;
