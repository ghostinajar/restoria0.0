import validCommandWords from '../constants/validCommandWords.js';

function isValidCommandWord (commandWord) {
    if (!validCommandWords.includes(commandWord.toLowerCase())) {
        console.log(`User entered invalid command: ${commandWord}`);
        return false;
    }
    return true;
};

export default isValidCommandWord;
