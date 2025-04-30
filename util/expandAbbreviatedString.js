// expandAbbreviatedString
// returns the provided string or an expanded version from a provided array of options
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
function expandAbbreviatedString(providedString, expandedStrings) {
    try {
        let output = providedString || "";
        if (providedString) {
            for (const expandedString of expandedStrings) {
                if (expandedString.startsWith(providedString)) {
                    output = expandedString;
                    break;
                }
            }
        }
        return output;
    }
    catch (error) {
        catchErrorHandlerForFunction(`expandAbbreviatedString`, error);
    }
}
export default expandAbbreviatedString;
