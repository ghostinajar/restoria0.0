// padStringToLength79
// returns the given string as a heading 79 characters long,
// flanked by a row of a given padding character (default =========)
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
function padStringToLength79(input, paddingChar = "=") {
    try {
        const totalLength = 79;
        const stringWithSpaces = ` ${input} `;
        const paddingNeeded = totalLength - stringWithSpaces.length;
        if (paddingNeeded <= 0) {
            return stringWithSpaces;
        }
        const paddingEachSide = Math.floor(paddingNeeded / 2);
        const leftPadding = paddingChar.repeat(paddingEachSide);
        const rightPadding = paddingChar.repeat(paddingEachSide + (paddingNeeded % 2));
        return leftPadding + stringWithSpaces + rightPadding;
    }
    catch (error) {
        catchErrorHandlerForFunction(`padStringToLength79`, error);
        return input;
    }
}
export default padStringToLength79;
