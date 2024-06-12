// isValidCommandWord
import validCommandWords from '../constants/validCommandWords.js';
import logger from '../logger.js';

//TODO accept and log entire command object, not just commandWord
function isValidCommandWord (commandWord: string) {
    if (!validCommandWords.includes(commandWord.toLowerCase())) {
        logger.error(`Server detected invalid commandWord: ${commandWord}`);
        return false;
    }
    return true;
};

export default isValidCommandWord;