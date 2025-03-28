import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";

function padStringToLength79(input: string, paddingChar: string = "="): string {
  try {
    const totalLength = 80;
    const stringWithSpaces = ` ${input} `;
    const paddingNeeded = totalLength - stringWithSpaces.length;

    if (paddingNeeded <= 0) {
      return stringWithSpaces;
    }

    const paddingEachSide = Math.floor(paddingNeeded / 2);
    const leftPadding = paddingChar.repeat(paddingEachSide);
    const rightPadding = paddingChar.repeat(
      paddingEachSide + (paddingNeeded % 2)
    );

    return leftPadding + stringWithSpaces + rightPadding;
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`padStringToLength79`, error);
    return input;
  }
}

export default padStringToLength79;
