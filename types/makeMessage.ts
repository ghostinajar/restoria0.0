// makeMessage.ts
import Message from "./Message.js";

function makeMessage(userGen : boolean, type : string, content : string | Array<string>) : Message {
    let message = {
        userGen : userGen,
        type : type,
        content : content
    }
    return message;
}

export default makeMessage;