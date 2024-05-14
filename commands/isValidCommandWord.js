import validCommandWords from '../constants/validCommandWords.js';

//TODO accept and log entire command object, not just commandWord
function isValidCommandWord (commandWord) {
    if (!validCommandWords.includes(commandWord.toLowerCase())) {
        console.log(`Client-side validation failed. Server detected invalid commandWord: ${commandWord}`);
        return false;
    }
    return true;
};

export default isValidCommandWord;
