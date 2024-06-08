// message.ts

interface Message {
    userGen : boolean;
    type : string;
    content : string | Array<string>;
}

export default Message; 