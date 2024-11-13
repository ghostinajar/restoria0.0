// getNameById
// returns first name string from an array of {name, _id} that matches id
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
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
        catchErrorHandlerForFunction("getNameById", error);
    }
}
export default getNameById;
