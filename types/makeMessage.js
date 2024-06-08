function makeMessage(userGen, type, content) {
    let message = {
        userGen: userGen,
        type: type,
        content: content
    };
    return message;
}
export default makeMessage;
