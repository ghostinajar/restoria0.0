// ZoneManager
import logger from "../../logger.js";
import Zone, { IZone } from "./Zone.js";
import worldEmitter from "./WorldEmitter.js";
import resetUserLocation from "../../util/resetUserLocation.js";
import { IUser } from "./User.js";
import mongoose from "mongoose";
import { IRoom } from "./Room.js";
import { ILocation } from "./Location.js";
import COMPLETION_STATUS from "../../constants/COMPLETION_STATUS.js";
import catchErrorHandlerForFunction from "../../util/catchErrorHandlerForFunction.js";

class ZoneManager {
  constructor() {
    this.zones = new Map();

    worldEmitter.on("roomRequested", this.roomRequestedHandler);
    worldEmitter.on("socketDisconnectedUser", this.userLogoutHandler);
    worldEmitter.on("placeUserRequest", this.placeUserRequestHandler);
    worldEmitter.on("zoneRequested", this.zoneRequestedHandler);
  }

  zones: Map<string, IZone>;

  roomRequestedHandler = async (location: ILocation) => {
    try {
      // get the zone, then get the room
      let zone = await this.getZoneById(location.inZone);
      const room = zone?.rooms.find(
        (room) => room._id.toString() === location.inRoom.toString()
      );
      if (!room) {
        logger.error(
          `lookArrayRequestedHandler got an undefined room for location ${JSON.stringify(
            location
          )}`
        );
        return;
      }
      worldEmitter.emit(`zoneManagerReturningRoom${room._id.toString()}`, room);
    } catch (error: unknown) {
      catchErrorHandlerForFunction("ZoneManager.roomRequestedHandler", error);
    }
  };

  userLogoutHandler = async (user: mongoose.Document & IUser) => {
    try {
      // find (or reset) user's location on logout
      let { inRoom, inZone } = user.location;
      let zone: IZone | undefined = this.zones.get(inZone.toString());
      if (!zone) {
        logger.error(
          "User location zone not found at logout! Reset to world recall."
        );
        await resetUserLocation(user);
        return;
      }

      let room: IRoom | undefined = zone.rooms.find(
        (room) => room._id.toString() == inRoom.toString()
      );
      if (!room) {
        logger.error(
          "User location room not found at logout! Reset to world recall."
        );
        await resetUserLocation(user);
        return;
      }

      //remove user from location
      room.removeEntityFrom("users", user);
      worldEmitter.emit("zoneManagerRemovedUser", user);
    } catch (error: unknown) {
      catchErrorHandlerForFunction("ZoneManager.userLogoutHandler", error);
    }
  };

  placeUserRequestHandler = async (user: IUser) => {
    this.placeUserInStoredLocation(user);
  };

  zoneRequestedHandler = async (zoneId: mongoose.Types.ObjectId) => {
    try {
      let zone = await this.getZoneById(zoneId);
      if (!zone) {
        logger.error(`zone requested (${zoneId.toString}) that doesn't exist`);
      }
      worldEmitter.emit(`zone${zoneId.toString()}Loaded`, zone);
    } catch (error: unknown) {
      catchErrorHandlerForFunction(`ZoneManager.zoneRequestedHandler`, error);
    }
  };

  async addZoneById(id: mongoose.Types.ObjectId): Promise<IZone | undefined> {
    try {
      //load from db
      const zone: IZone | null = await Zone.findById(id);
      if (!zone) {
        logger.error(`addZoneById couldn't get a zone with id ${id} from db`);
        return undefined;
      }

      // add to zones map
      this.zones.set(zone._id.toString(), zone);
      logger.info(`zoneManager added ${zone.name} to zones.`);
      // logger.log(
      //   `loadout`,
      //   `Rooms in zone "${zone.name}": ${zone.rooms.map((room) => room.name)}.`
      // );
      // logger.log(
      //   `loadout`,
      //   `Active zones: ${JSON.stringify(
      //     Array.from(this.zones.values()).map((zone) => zone.name)
      //   )}`
      // );

      // if blueprints are empty, add dummy data (necessary for user forms)
      if (zone.itemBlueprints.length === 0) {
        zone.itemBlueprints = [
          {
            _id: new mongoose.Types.ObjectId(),
            author: new mongoose.Types.ObjectId("665bc7ca1eeaedf3a5da7446"),
            name: `an apple`,
            itemType: `none`,
            price: 0,
            minimumLevel: 0,
            history: {
              creationDate: new Date(),
              modifiedDate: new Date(),
              completionStatus: COMPLETION_STATUS.DRAFT,
            },
            description: {
              look: `There's a basic apple here.`,
              examine: `It's red and shiny. With this kind of apple, when you've seen one you've seen them all.`,
            },
            tags: {
              cleric: true,
              mage: true,
              rogue: true,
              warrior: true,
              dark: true,
              neutral: true,
              light: true, //can be equipped by players with a light aura
              guild: false,
              food: true,
              lamp: false, //lights up the room
              hidden: false,
              fixture: false,
              quest: false,
              temporary: false,
              container: false,
            },
            keywords: ["apple"],
            tweakDuration: 182,
          },
        ];
      }
      if (zone.mobBlueprints.length === 0) {
        zone.mobBlueprints = [
          {
            _id: new mongoose.Types.ObjectId(),
            author: new mongoose.Types.ObjectId("665bc7ca1eeaedf3a5da7446"),
            name: "a goblin",
            pronouns: 1,
            history: {
              creationDate: new Date(),
              modifiedDate: new Date(),
              completionStatus: COMPLETION_STATUS.DRAFT,
            },
            level: 1,
            job: "rogue",
            statBlock: {
              strength: 10,
              dexterity: 10,
              constitution: 10,
              intelligence: 10,
              wisdom: 10,
              charisma: 10,
              spirit: 10,
            },
            goldHeld: 0,
            isUnique: false,
            isMount: false,
            isAggressive: false,
            chattersToPlayer: false,
            emotesToPlayer: false,
            description: {
              look: `There's a basic goblin here.`,
              examine: `He's green and mean. With this kind of goblin, when you've seen one you've seen them all.`,
            },
            keywords: [`goblin`],
            affixes: [],
            chatters: [],
            emotes: [],
            itemNodes: [],
          },
        ];
      }

      await zone.initRooms();
      return zone;
    } catch (error: unknown) {
      catchErrorHandlerForFunction(`ZoneManager.addZoneById`, error);
    }
  }

  async getZoneById(id: mongoose.Types.ObjectId) {
    try {
      let zone = this.zones.get(id.toString());
      if (!zone) {
        zone = await this.addZoneById(id);
      }
      if (!zone) {
        logger.error(`zoneManager can't find zone with id: ${id}.`);
        return null;
      }
      return zone;
    } catch (error: unknown) {
      catchErrorHandlerForFunction(`ZoneManager.getZoneById`, error);
    }
  }

  async placeUserInStoredLocation(user: IUser) {
    try {
      if (!user) {
        logger.error(`placeUserInStoredLocation received an undefined user`);
        return;
      }

      // Reset user location if necessary
      if (!user.location.inRoom || !user.location.inZone) {
        logger.error("User location missing, reset to worldRecall.");
        await resetUserLocation(user);
      }

      // Load zone if necessary
      let zone = await this.getZoneById(user.location.inZone);
      if (!zone) {
        logger.error("User location missing, reset to worldRecall.");
        await resetUserLocation(user);
        zone = this.zones.get(user.location.inZone.toString());
      }

      // If zone still doesn't exist, log error and return
      if (!zone) {
        logger.error(`Couldn't reset user location. Failed to place user.`);
        return;
      }

      // Find room in the zone
      let room: IRoom | undefined = zone.rooms.find(
        (room) => room._id.toString() == user.location.inRoom.toString()
      );

      // If room doesn't exist, reset user location and try to find the room again
      if (!room) {
        logger.error("User location missing, reset to worldRecall.");
        await resetUserLocation(user);
        zone = this.zones.get(user.location.inZone.toString());
        room = zone?.rooms.find(
          (room) => room._id.toString() == user.location.inRoom.toString()
        );
      }

      // If room or zone still doesn't exist, log error and return
      if (!room || !zone) {
        logger.error(`Couldn't reset user location. Failed to place user.`);
        return;
      }

      // Place user in room
      room.addEntityTo("users", user);
      logger.info(`User ${user.name} placed in ${room.name}.`);
    } catch (error: unknown) {
      catchErrorHandlerForFunction(
        "ZoneManager.placeUserInStoredLocation",
        error
      );
    }
  }

  async removeZoneById(id: mongoose.Types.ObjectId) {
    try {
      const zone = this.zones.get(id.toString());
      if (zone) {
        await zone.clearRooms();
        this.zones.delete(id.toString());
      } else {
        logger.warn(`Zone with id ${id} does not exist in zones.`);
      }
    } catch (error: unknown) {
      catchErrorHandlerForFunction(`ZoneManager.removeZoneById`, error);
    }
  }

  clearContents() {
    this.zones.clear();
    worldEmitter.off("roomRequested", this.roomRequestedHandler);
    worldEmitter.off("socketDisconnectedUser", this.userLogoutHandler);
    worldEmitter.off("placeUserRequest", this.placeUserRequestHandler);
    worldEmitter.off("zoneRequested", this.zoneRequestedHandler);
  }
}

export default ZoneManager;
