// studyresearch
// shows the user the study or research description of room or target
import worldEmitter from "../model/classes/WorldEmitter.js";
import { IUser } from "../model/classes/User.js";
import { IParsedCommand } from "../util/parseCommand.js";
import getRoomOfUser from "../util/getRoomOfUser.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import selectTargetByOrdinal from "../util/selectTargetByOrdinal.js";
import makeMessage from "../util/makeMessage.js";
import { IRoom } from "../model/classes/Room.js";
import { IItem } from "../model/classes/Item.js";
import { IMob } from "../model/classes/Mob.js";
import messageMissingTargetToUser from "../util/messageMissingTargetToUser.js";

async function studyresearch(parsedCommand: IParsedCommand, user: IUser) {
  try {
    function studyresearchForObject(
      object: IRoom | IUser | IItem | IMob,
      research: boolean
    ) {
      if (research) {
        if (object.description.research) {
          let messageArray = [];
          messageArray.push(makeMessage(`heading`, object.name));
          messageArray.push(
            makeMessage(`description`, object.description.research)
          );
          worldEmitter.emit(`messageArrayFor${user.username}`, messageArray);
        } else {
          worldEmitter.emit(
            `messageFor${user.username}`,
            makeMessage(
              `failure`,
              `There's not much to research about that ${targetKeyword}. Try EXAMINE ${targetKeyword?.toUpperCase()} instead.`
            )
          );
        }
      } else {
        if (object.description.study) {
          let messageArray = [];
          messageArray.push(makeMessage(`heading`, object.name));
          messageArray.push(
            makeMessage(`description`, object.description.study)
          );
          worldEmitter.emit(`messageArrayFor${user.username}`, messageArray);
        } else {
          worldEmitter.emit(
            `messageFor${user.username}`,
            makeMessage(
              `failure`,
              `There's not much to study about that ${targetKeyword}. Try EXAMINE ${targetKeyword?.toUpperCase()} instead.`
            )
          );
        }
      }
    }

    const room = await getRoomOfUser(user);
    if (!room) {
      throw new Error(`Room not found for user ${user.name}`);
    }

    let targetKeyword = parsedCommand.directObject;
    let research = false;
    if (parsedCommand.commandWord === "research") {
      research = true;
    }

    // target is missing or room?
    if (!targetKeyword || targetKeyword === "room") {
      studyresearchForObject(room, research);
      return;
    }

    // target is a user?
    let userObject = room.users.find((user) => user.username === targetKeyword);
    if (userObject) {
      studyresearchForObject(userObject, research);
      return;
    }

    //target is a mob?
    let targetOrdinal = parsedCommand.directObjectOrdinal || 0;
    let mobObject = selectTargetByOrdinal(
      targetOrdinal,
      targetKeyword,
      room.mobs
    );
    if (mobObject) {
      studyresearchForObject(mobObject, research);
      return;
    }

    //target is an item?
    let itemObject = selectTargetByOrdinal(
      targetOrdinal,
      targetKeyword,
      room.inventory
    );
    if (itemObject) {
      studyresearchForObject(itemObject, research);
      return;
    }

    messageMissingTargetToUser(user, targetKeyword);
  } catch (error: unknown) {
    catchErrorHandlerForFunction("studyresearch", error, user.name);
  }
}

export default studyresearch;
