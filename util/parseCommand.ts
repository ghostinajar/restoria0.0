// parseCommand
// processes a full user input string into components in an object
// e.g. {commandWord, directObject?, indirectObject?, string?}
import validCommandWords, {
  commandsWith1Param,
  commandsWith2Params,
} from "../constants/validCommandWords.js";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
import expandAbbreviatedString from "./expandAbbreviatedString.js";

export interface IParsedCommand {
  commandWord: string;
  directObject?: string;
  directObjectOrdinal?: number;
  indirectObject?: string;
  indirectObjectOrdinal?: number;
  string?: string;
  targetsAll?: boolean;
}

function parseCommand(command: string) {
  try {
    const parsedCommand: IParsedCommand = {
      commandWord: ``,
    };
    let splitCommand = command.split(" ");

    // treat "look at/in" as "look"
    if (splitCommand[0] === "look" || splitCommand[0] === "l") {
      if (splitCommand[1] === "at" || splitCommand[1] === "in") {
        splitCommand.splice(1, 1);
      }
    }

    // treat "get x from y" as "get x y"
    if (splitCommand[0] === "get" || splitCommand[0] === "g") {
      if (splitCommand[2] === "from") {
        splitCommand.splice(2, 1);
      }
    }

    parsedCommand.commandWord = expandAbbreviatedString(
      splitCommand[0].toLowerCase(),
      validCommandWords
    );

    function parseAndPackageObject(objectStr: string, isDirectObject: boolean) {
      const lowerObj = objectStr.toLowerCase();
      if (lowerObj.startsWith("all.")) {
        if (isDirectObject) {
          parsedCommand.targetsAll = true;
          parsedCommand.directObject = lowerObj.substring(4); // removes 'all.'
        } else {
          parsedCommand.indirectObject = lowerObj;
        }
      } else if (hasOrdinalPrefix(lowerObj)) {
        const { ordinal, object } = parseOrdinalFromObject(lowerObj);
        if (isDirectObject) {
          parsedCommand.directObjectOrdinal = ordinal;
          parsedCommand.directObject = object;
        } else {
          parsedCommand.indirectObjectOrdinal = ordinal;
          parsedCommand.indirectObject = object;
        }
      } else {
        if (isDirectObject) {
          parsedCommand.directObject = lowerObj;
        } else {
          parsedCommand.indirectObject = lowerObj;
        }
      }
    }

    if (commandsWith1Param.find((word) => word === parsedCommand.commandWord)) {
      if (splitCommand[1]) {
        parseAndPackageObject(splitCommand[1], true);
      }
      if (splitCommand.length > 2) {
        parsedCommand.string = splitCommand.slice(2).join(" ");
      }
    } else if (
      commandsWith2Params.find((word) => word === parsedCommand.commandWord)
    ) {
      if (splitCommand[1]) {
        parseAndPackageObject(splitCommand[1], true);
      }
      if (splitCommand[2]) {
        parseAndPackageObject(splitCommand[2], false);
      }
      if (splitCommand.length > 3) {
        parsedCommand.string = splitCommand.slice(3).join(" ");
      }
    } else {
      parsedCommand.string = splitCommand.slice(1).join(" ");
    }
    return parsedCommand;
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`parseCommand`, error);
    return { commandWord: "command-parsing-error" };
  }
}

function hasOrdinalPrefix(str: string): boolean {
  // Only match if number is greater than 0
  return /^[1-9]\d*\./.test(str);
}

function parseOrdinalFromObject(object: string) {
  const match = object.match(/^(\d+)\.(.*)/);
  const userOrdinal = parseInt(match![1], 10);
  const ordinal = userOrdinal - 1;
  const cleanedObject = match![2];
  return { ordinal, object: cleanedObject };
}

export default parseCommand;
