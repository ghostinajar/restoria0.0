// bugs
// shows user a list of valid bugs in queue to fix
import Bug from "../model/classes/Bug.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import makeMessage from "../util/makeMessage.js";
async function bugs(user) {
    try {
        const validBugs = await Bug.find({ isValid: true }, // Filter for isValid true
        { date: 1, description: 1, _id: 0 } // Projection to include only date and description
        );
        const validBugStrings = validBugs.map(bug => {
            return makeMessage("message", `${bug.date}: ${bug.description}`);
        });
        console.log(validBugStrings);
        worldEmitter.emit(`messageArrayFor${user.username}`, validBugStrings);
    }
    catch (error) {
        catchErrorHandlerForFunction(`bugs`, error, user?.name);
    }
}
export default bugs;
