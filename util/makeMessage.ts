// makeMessage.ts
// creates a message object (usually for emitting to a user socket)
import IMessage from "../types/Message.js";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";

function makeMessage(type : string, content : string | Array<string>) : IMessage {
    try {
   let message = {
        type : type,
        content : content
    }
    return message;
    } catch (error: unknown) {
      catchErrorHandlerForFunction(`makeMessage`, error);
      return {
        type: `rejection`,
        content : `System error in creating message!`
      }
    }
   
}

export default makeMessage;