import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
function isValidName(name) {
    try {
        if (name.length > 18 || !/^[a-zA-Z]+$/.test(name)) {
            return false;
        }
        else {
            return true;
        }
    }
    catch (error) {
        catchErrorHandlerForFunction(`functionName`, error);
        return false;
    }
}
export default isValidName;
