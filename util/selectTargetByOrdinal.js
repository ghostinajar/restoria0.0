import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
function selectTargetByOrdinal(ordinal, keyword, array) {
    try {
        const filteredArray = array.filter((object) => object.keywords.includes(keyword));
        return filteredArray[ordinal];
    }
    catch (error) {
        catchErrorHandlerForFunction(`selectTargetByOrdinal`, error);
    }
}
export default selectTargetByOrdinal;
