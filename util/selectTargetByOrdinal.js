import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
function selectTargetByOrdinal(ordinal, keyword, array) {
    try {
        const filteredArray = array.filter((object) => object.keywords.some((key) => key.startsWith(keyword)));
        return filteredArray[ordinal];
    }
    catch (error) {
        catchErrorHandlerForFunction(`selectTargetByOrdinal`, error);
    }
}
export default selectTargetByOrdinal;
