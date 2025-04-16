// messageMissingTargetToUser
import messageToUsername from "./messageToUsername.js";
function messageMissingTargetToUser(user, keyword) {
    messageToUsername(user.username, `You can't seem to find the ${keyword}.`, `rejection`, false);
}
export default messageMissingTargetToUser;
