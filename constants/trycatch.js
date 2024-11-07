import logger from "../logger";
import worldEmitter from "../model/classes/WorldEmitter";
import makeMessage from "../util/makeMessage";
const user = { username: "Ralu" };
try {
}
catch (error) {
    worldEmitter.emit(`messageFor${user.username}`, makeMessage("rejection", `There was an error on our server. Ralu will have a look at it soon!`));
    if (error instanceof Error) {
        logger.error(`server error for user ${user.username}: ${error.message}`);
    }
    else {
        logger.error(`server error for user ${user.username}: ${error}`);
    }
}
