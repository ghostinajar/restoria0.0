import { IUser } from "../model/classes/User.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import { IZone } from "../model/classes/Zone.js";
import makeMessage from "../types/makeMessage.js";
import getRoomOfUser from "../util/getRoomOfUser.js";
import getZoneOfUser from "../util/getZoneofUser.js";
import { IParsedCommand } from "../util/parseCommand.js";

async function edit(parsedCommand: IParsedCommand, user: IUser) {
  let target = parsedCommand.directObject;
  const zone: IZone = await getZoneOfUser(user);
  const itemBlueprintList = zone.itemBlueprints.map((blueprint) => {
    return { id: blueprint._id, value: blueprint.name };
  });
  const mobBlueprintList = zone.mobBlueprints.map((blueprint) => {
    return { id: blueprint._id, value: blueprint.name };
  });

  if (target !== "user" && zone.author.toString() !== user._id.toString()) {
    worldEmitter.emit(
      `messageFor${user.username}`,
      makeMessage(`rejection`, `You aren't an author for this zone.`)
    );
    return;
  }

  if (!target) {
    worldEmitter.emit(
      `messageFor${user.username}`,
      makeMessage(`rejection`, `Edit what?`)
    );
    return;
  }

  switch (target) {
    case `item`: {
      worldEmitter.emit(`formPromptFor${user.username}`, {
        form: `editItemSelect`,
        list: itemBlueprintList,
      });
      break;
    }
    case `mob`: {
      const zone: IZone = await getZoneOfUser(user);
      worldEmitter.emit(`formPromptFor${user.username}`, {
        form: `editMobSelect`,
        list: mobBlueprintList,
      });
      break;
    }
    case `room`: {
      const room = await getRoomOfUser(user);
      worldEmitter.emit(`formPromptFor${user.username}`, {
        form: `editRoomForm`,
        roomData: {
          _id: room._id,
          name: room.name,
          description: room.description,
          isDark: room.isDark,
          isIndoors: room.isIndoors,
          isOnWater: room.isOnWater,
          isUnderwater: room.isUnderwater,
          noMounts: room.noMagic,
          noMobs: room.noMobs,
          noMagic: room.noMagic,
          noCombat: room.noCombat,
          mobNodes: room.mobNodes,
          itemNodes: room.itemNodes,
          exits: room.exits,
        },
        zoneData: {
          items: zone.itemBlueprints,
          mobs: zone.mobBlueprints,
          rooms: zone.rooms,
        },
      });
      break;
    }
    case `user`: {
      worldEmitter.emit(`formPromptFor${user.username}`, {
        form: `editUserForm`,
        examine: user.description.examine,
        study: user.description.study,
        research: user.description.research,
      });
      break;
    }
    default: {
      worldEmitter.emit(
        `messageFor${user.username}`,
        makeMessage(`rejection`, `Edit what?`)
      );
      return;
    }
  }
}

export default edit;
