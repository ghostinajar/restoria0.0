import logger from "../logger.js";
function getNameById(array, id) {
    try {
        for (let object of array) {
            if (object._id.toString() === id) {
                return object.name;
            }
        }
        return null;
    }
    catch (error) {
        if (error instanceof Error) {
            logger.error(`getNameById error: ${error.message}`);
        }
        else {
            logger.error(`getNameById error: ${error}`);
        }
    }
}
export default getNameById;
