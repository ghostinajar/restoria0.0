// updates
// shows user a list of recent updates (fixed bugs, etc)
import Bug from "../model/classes/Bug.js";
import { IUser } from "../model/classes/User.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import formatDate from "../util/formatDate.js";
import { IParsedCommand } from "../util/parseCommand.js";

async function updates(parsedCommand: IParsedCommand, user: IUser) {
  try {
    let updateQuantity = 10;
    let requestedQuantity : number = Number(parsedCommand.directObject);
    if (requestedQuantity) {
      updateQuantity = requestedQuantity;
    }
    if (parsedCommand.directObject?.toLowerCase() === "all") {
      updateQuantity = 0;
    }
    const fixedBugs = await Bug.find(
      { isFixed: true },
      { date: 1, description: 1, _id: 0 }
    )
      .sort({ date: -1 })
      .limit(updateQuantity);


    // format the date and description of each bug and sort oldest to newest
    const updatesArray = fixedBugs.map((bug) => {
      const formattedDate = formatDate(bug.date);
      return {date: formattedDate, content: bug.description};
    })

    updatesArray.reverse();
    
    worldEmitter.emit(`updatesArrayFor${user.username}`, updatesArray);
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`bugs`, error, user?.name);
  }
}

export default updates;
