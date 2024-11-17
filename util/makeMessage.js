import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
function makeMessage(type, content) {
    try {
        let message = {
            type: type,
            content: content
        };
        return message;
    }
    catch (error) {
        catchErrorHandlerForFunction(`functionName`, error);
        return {
            type: `rejection`,
            content: `System error in creating message!`
        };
    }
}
export default makeMessage;
