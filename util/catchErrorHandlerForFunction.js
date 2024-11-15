import logger from "../logger.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import makeMessage from "./makeMessage.js";
function catchErrorHandlerForFunction(functionName, error, username) {
    const message = makeMessage("rejection", `There was an error on our server. Ralu will have a look at it soon!`);
    if (username) {
        worldEmitter.emit(`messageFor${username}`, message);
        if (error instanceof Error) {
            logger.error(`"${functionName}" error for user ${username}: ${error.message}`);
        }
        else {
            logger.error(`"${functionName}" error for user ${username}: ${error}`);
        }
    }
    else {
        if (error instanceof Error) {
            logger.error(`"${functionName}" error: ${error.message}`);
        }
        else {
            logger.error(`"${functionName}" error: ${error}`);
        }
    }
}
let user = { name: "Ralu" };
try {
}
catch (error) {
    catchErrorHandlerForFunction(`functionName`, error, user?.name);
}
export default catchErrorHandlerForFunction;
