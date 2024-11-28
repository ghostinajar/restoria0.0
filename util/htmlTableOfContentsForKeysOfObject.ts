// htmlTableOfContentsForKeysOfObject
// takes any object and returns an html table listing its keys

import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";

function htmlTableOfContentsForKeysOfObject(obj: Record<string, any>): string {
  try {
    // Extract and sort the keys alphabetically
    const keys = Object.keys(obj).sort();

    // Determine the number of rows needed for three columns
    const columnCount = 3;
    const rowCount = Math.ceil(keys.length / columnCount);

    // Create rows for the table, filling them horizontally
    const rows: string[][] = Array.from({ length: rowCount }, () => []);
    for (let i = 0; i < keys.length; i++) {
      rows[Math.floor(i / columnCount)].push(keys[i]);
    }

    // Build the HTML table
    let tableHtml = `<table style="border-collapse: collapse; width: 100%;">\n<tbody>\n`;

    for (const row of rows) {
      tableHtml += `<tr>\n`;
      for (let i = 0; i < columnCount; i++) {
        const key = row[i] || ""; // Fill empty cells with an empty string
        tableHtml += `<td style="padding: 0;">${key}</td>\n`;
      }
      tableHtml += `</tr>\n`;
    }

    tableHtml += `</tbody>\n</table>\n`;

    return tableHtml;
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`htmlTableOfContentsForKeysOfObject`, error);
    return `There was an error making a table of contents for HELP. Ralu will have a look at it soon!`;
  }
}

export default htmlTableOfContentsForKeysOfObject;
