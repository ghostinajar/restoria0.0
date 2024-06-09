// makeMessage.ts
import IMessage from "./Message.js";

function makeMessage(userGen : boolean, type : string, content : string | Array<string>) : IMessage {
    let message = {
        userGen : userGen,
        type : type,
        content : content
    }
    return message;
}

export default makeMessage;