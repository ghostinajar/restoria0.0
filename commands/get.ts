// get
// user can get objects from the ground or from containers

import { IUser } from "../model/classes/User.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import { IParsedCommand } from "../util/parseCommand.js";

async function get(parsedCommand: IParsedCommand, user: IUser) {
  try {
    console.log(`get command executed by ${user?.name}`);
    console.log(`parsedCommand:`, parsedCommand);
    // if no directObject specified, fail and notify user they need to specify what to get
    // find the inventory to get from:
      // if container is not specified, succeed with room.inventory
      // if container is specified:
        // if container is in user inventory, succeed with user.inventory
        // if container is in room.inventory:
          // if indirectObjectOrdinal is not specified, succeed with container.inventory of the first match in room.inventory
          // if indirectObjectOrdinal is specified, get matchingContainers from room.inventory, and succeed with container.inventory of the matchingContainers[ordinal]
        // if container is in room.mobs, fail and notify user not to get from mobs
        // at this point we can fail and notify user they can't find the container to look in

    // find the target object(all) in container
      // 
    // add target to player inventory
    // remove target from room or container
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`get`, error, user?.name);
  }
}

export default get;
