// putNumberInRange
// conforms a given oob number to given range, logs it
import logger from "../logger.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
import makeMessage from "./makeMessage.js";
function putNumberInRange(minVal, maxVal, userNumber, user) {
    try {
        const culprit = user?.name || "Unknown";
        function logOobNum(oobNum, correctedNumber) {
            logger.warn(`User ${culprit} entered out-of-bounds number ${oobNum}, corrected to ${correctedNumber}.`);
        }
        function notifyUser(user, oobNum, correctedNumber) {
            worldEmitter.emit(`messageFor${user.username}`, makeMessage("help", `Your form contained an out-of-bounds number (${oobNum}), corrected to ${correctedNumber}. If this is a bug, contact Ralu. If you meant to break the form, go sit in the corner. Think about your life. Think about your choices.`));
        }
        if (userNumber > maxVal) {
            logOobNum(userNumber, maxVal);
            if (user) {
                notifyUser(user, userNumber, maxVal);
            }
            return maxVal;
        }
        if (userNumber < minVal) {
            logOobNum(userNumber, minVal);
            if (user) {
                notifyUser(user, userNumber, minVal);
            }
            return minVal;
        }
        return userNumber;
    }
    catch (error) {
        catchErrorHandlerForFunction("putNumberInRange", error);
        return userNumber;
    }
}
export default putNumberInRange;
