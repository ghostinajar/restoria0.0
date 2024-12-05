// bugs
// shows user a list of valid bugs in queue to fix
import Bug from "../model/classes/Bug.js";
import { IUser } from "../model/classes/User.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import makeMessage from "../util/makeMessage.js";

async function bugs(user: IUser) {
  try {
    const validBugs = await Bug.find(
      { isValid: true }, 
      { date: 1, description: 1, _id: 0 } 
    );
    
    const formatDate = (date: Date): string => {
      return new Intl.DateTimeFormat('en-GB', { 
        year: '2-digit', 
        month: '2-digit', 
        day: '2-digit' 
      }).format(new Date(date));
    };

    const validBugStrings = validBugs.map(bug => {
      const formattedDate = formatDate(bug.date);
      return makeMessage("message", `${formattedDate}: ${bug.description}`);
    });
    validBugStrings.unshift(makeMessage(`help`, `Current known bugs in Restoria:`));
    worldEmitter.emit(`messageArrayFor${user.username}`, validBugStrings);
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`bugs`, error, user?.name);
  }
}

export default bugs;
