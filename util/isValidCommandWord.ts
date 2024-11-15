// isValidCommandWord
import validCommandWords from "../constants/validCommandWords.js";
import logger from "../logger.js";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";

function isValidCommandWord(commandWord: string) {
  try {
    if (!validCommandWords.includes(commandWord.toLowerCase())) {
      logger.error(`Server detected invalid commandWord: ${commandWord}`);
      return false;
    }
    return true;
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`isValidCommandWord`, error);
  }
}

export default isValidCommandWord;
