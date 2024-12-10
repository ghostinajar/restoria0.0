// formatDate
// return a Date in YY/MM/DD format
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";

function formatDate(date: Date): string {
  try {
    return new Intl.DateTimeFormat("ja-JP", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(date));
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`formatDate`, error);
    return "error in formatDate";
  }
}
export default formatDate;
