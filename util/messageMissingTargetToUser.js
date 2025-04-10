// messageMissingTargetToUser
import messageToUsername from "./messageToUsername.js";
function messageMissingTargetToUser(user, keyword) {
    messageToUsername(user.username, `You can't seem to find the ${keyword}.`, `failure`, false);
}
export default messageMissingTargetToUser;
