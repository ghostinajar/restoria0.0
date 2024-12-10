// updates
// shows user a list of recent updates (fixed bugs, etc)
import Bug from "../model/classes/Bug.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import formatDate from "../util/formatDate.js";
import makeMessage from "../util/makeMessage.js";
async function updates(user) {
    try {
        const fixedBugs = await Bug.find({ isFixed: true }, { date: 1, description: 1, _id: 0 })
            .sort({ date: -1 })
            .limit(20);
        const fixedBugStrings = fixedBugs.map((bug) => {
            const formattedDate = formatDate(bug.date);
            return makeMessage("success", `${formattedDate}: ${bug.description}`);
        });
        fixedBugStrings.unshift(makeMessage(`help`, `Recent Updates in Restoria:`));
        worldEmitter.emit(`messageArrayFor${user.username}`, fixedBugStrings);
    }
    catch (error) {
        catchErrorHandlerForFunction(`bugs`, error, user?.name);
    }
}
export default updates;
