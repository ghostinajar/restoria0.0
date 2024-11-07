// edit
// switch on target to open edit form for item, mob, room, zone, or user/character
import { IRoom } from "../model/classes/Room.js";
import { IUser } from "../model/classes/User.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import { IZone } from "../model/classes/Zone.js";
import makeMessage from "../util/makeMessage.js";
import getItemBlueprintNamesFromZone from "../util/getItemBlueprintNamesFromZone.js";
import getMobBlueprintNamesFromZone from "../util/getMobBlueprintNamesFromZone.js";
import getRoomOfUser from "../util/getRoomOfUser.js";
import getZoneOfUser from "../util/getZoneofUser.js";
import { IParsedCommand } from "../util/parseCommand.js";
import { spells } from "../constants/SPELL.js";
import { itemTypes } from "../constants/ITEM_TYPE.js";
import { affixTypes } from "../constants/AFFIX_TYPE.js";
import { damageTypes } from "../constants/DAMAGE_TYPE.js";
import userHasZoneAuthorId from "../util/userHasZoneAuthorId.js";
import logger from "../logger.js";
import getRoomNamesFromZone from "../util/getRoomNamesFromZone.js";

async function edit(parsedCommand: IParsedCommand, user: IUser) {
  try {
    let target = parsedCommand.directObject;
    const zone: IZone = await getZoneOfUser(user);

    if (!target) {
      worldEmitter.emit(
        `messageFor${user.username}`,
        makeMessage(`rejection`, `Edit what?`)
      );
      return;
    }

    if (target !== "user" && target !== "character") {
      if (!userHasZoneAuthorId(zone.author.toString(), user)) {
        return;
      }
    }

    switch (target) {
      case `item`: {
        worldEmitter.emit(`formPromptFor${user.username}`, {
          form: `editItemBlueprintForm`,
          itemBlueprintNames: getItemBlueprintNamesFromZone(zone),
          itemBlueprintFullData: zone.itemBlueprints,
          spells: spells,
          itemTypes: itemTypes,
          affixTypes: affixTypes,
          damageTypes: damageTypes,
        });
        break;
      }
      case `mob`: {
        const zone: IZone = await getZoneOfUser(user);
        worldEmitter.emit(`formPromptFor${user.username}`, {
          form: `editMobBlueprintForm`,
          mobBlueprintNames: getMobBlueprintNamesFromZone(zone),
          mobBlueprintFullData: zone.mobBlueprints,
          itemBlueprintNames: getItemBlueprintNamesFromZone(zone),
          affixTypes: affixTypes,
        });
        break;
      }
      case `room`: {
        const room = await getRoomOfUser(user);
        const itemBlueprintNames = getItemBlueprintNamesFromZone(zone);
        const mobBlueprintNames = getMobBlueprintNamesFromZone(zone);
        const itemNodes = getItemNodesFromRoom(room, zone);
        const mobNodes = getMobNodesFromRoom(room, zone);
        const roomList = getRoomNamesFromZone(zone);
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
            mobNodes: mobNodes,
            itemNodes: itemNodes,
            exits: room.exits,
          },
          zoneData: {
            itemBlueprintNames: itemBlueprintNames,
            mobBlueprintNames: mobBlueprintNames,
            rooms: roomList,
          },
        });
        break;
      }
      case `character`:
      case `user`: {
        worldEmitter.emit(`formPromptFor${user.username}`, {
          form: `editUserForm`,
          examine: user.description.examine,
          study: user.description.study,
          research: user.description.research,
        });
        break;
      }
      case `zone`: {
        const zone: IZone = await getZoneOfUser(user);
        worldEmitter.emit(`formPromptFor${user.username}`, {
          form: `editZoneForm`,
          zoneId: zone._id,
          name: zone.name,
          minutesToRespawn: zone.minutesToRespawn,
          description: zone.description,
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
  } catch (error: unknown) {
    worldEmitter.emit(
      `messageFor${user.username}`,
      makeMessage(
        "rejection",
        `There was an error on our server. Ralu will have a look at it soon!`
      )
    );
    if (error instanceof Error) {
      logger.error(`error in edit, ${error.message}`);
    } else {
      logger.error(`error in edit, ${error}`);
    }
  }
}

function getItemNodesFromRoom(room: IRoom, zone: IZone) {
  let itemNodesList = [];
  for (let node of room.itemNodes) {
    const itemName = getNameById(
      zone.itemBlueprints,
      node.loadsBlueprintId.toString()
    );
    //TODO handle cases where the item originates in another zone?
    const nodeObject = {
      _id: node._id,
      loadsBlueprintId: node.loadsBlueprintId,
      name: itemName || "",
    };
    itemNodesList.push(nodeObject);
  }
  return itemNodesList;
}

function getMobNodesFromRoom(room: IRoom, zone: IZone) {
  let mobNodesList = [];
  for (let node of room.mobNodes) {
    const mobName = getNameById(
      zone.mobBlueprints,
      node.loadsBlueprintId.toString()
    );
    //TODO handle cases where the mob originates in another zone
    const nodeObject = {
      _id: node._id,
      loadsBlueprintId: node.loadsBlueprintId,
      name: mobName,
    };
    mobNodesList.push(nodeObject);
  }
  return mobNodesList;
}

function getNameById(array: any, id: string) {
  for (let object of array) {
    if (object._id.toString() === id) {
      return object.name;
    }
  }
  return null;
}

export default edit;
