// makeMessage.ts
import IMessage from "../types/Message.js";

function makeMessage(type : string, content : string | Array<string>) : IMessage {
    let message = {
        type : type,
        content : content
    }
    return message;
}

export default makeMessage;