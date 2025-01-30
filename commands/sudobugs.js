// sudobugs
// admin command to manage bugs and updates
import Bug from "../model/classes/Bug.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import messageToUsername from "../util/messageToUsername.js";
async function sudobugs(parsedCommand, user) {
    try {
        if (!user?.isAdmin) {
            messageToUsername(user?.username, `That command is only available to admin.`, "failure", true);
            return;
        }
        const allBugs = await Bug.find({}, { date: 1, description: 1, isValid: 1, isFixed: 1, _id: 1 });
        const allBugsArray = [];
        allBugs.forEach((bug) => {
            let valid = "";
            let fixed = "";
            if (bug.isValid) {
                valid = "valid";
            }
            if (bug.isFixed) {
                fixed = "fixed";
            }
            allBugsArray.push(`${bug._id} ${valid} ${fixed}:\n${bug.description}`);
        });
        const allBugsString = allBugsArray.join("\n\n");
        messageToUsername(user?.username, `${allBugsString}`, "success", true);
    }
    catch (error) {
        catchErrorHandlerForFunction(`sudobugs`, error, user?.name);
    }
}
export default sudobugs;
