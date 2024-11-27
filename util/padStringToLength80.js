import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
function padStringToLength80(input, paddingChar = "=") {
    try {
        const totalLength = 80;
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
        catchErrorHandlerForFunction(`padStringToLength80`, error);
        return input;
    }
}
export default padStringToLength80;
