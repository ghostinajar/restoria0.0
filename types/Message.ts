// message.ts

interface IMessage {
    userGen : boolean;
    type : string;
    content : string | Array<string>;
}

export default IMessage; 