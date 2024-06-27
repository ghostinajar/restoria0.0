//zoneManager
import logger from "../../logger.js";
import Zone, { IZone } from "./Zone.js";
import worldEmitter from "./WorldEmitter.js";
import resetUserLocation from "../../util/resetUserLocation.js";
import { IUser } from "./User.js";
import mongoose from "mongoose";
import { IRoom } from "./Room.js";
import { ILocation } from "./Location.js";

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
    logger.debug(`roomRequestedHandler called, with ${JSON.stringify(location)}`);
    //get the room
    let zone = this.getZoneById(location.inZone) || await this.addZoneById(location.inZone);
    logger.debug(`roomRequestedHandler found zone ${zone?.name}`);
    logger.debug(`looking for room id ${location.inRoom.toString()}`);
    const room = zone?.rooms.find(room => room._id.toString() === location.inRoom.toString());
    if (!room) {
      logger.error(`lookArrayRequestedHandler got an undefined room`);
      return;
    }
    worldEmitter.emit(`zoneManagerReturningRoom${room._id.toString()}`, room);
  }

  userLogoutHandler = async (user: mongoose.Document & IUser) => {
    logger.debug(`userLogoutHandler called`);
    // find (or reset) user's location on logout
    let { inRoom, inZone } = user.location;
    let zone: IZone | undefined = this.zones.get(inZone.toString());
    if (!zone) {
      resetUserLocation(
        user,
        "User location not found at logout! Reset to world recall."
      );
      return;
    }
    logger.debug(`userLogoutHandler has zone ${zone.name}`);

    let room: IRoom | undefined = zone.rooms.find(
      (room) => room._id.toString() == inRoom.toString()
    );
    if (!room) {
      resetUserLocation(
        user,
        "User location not found at logout! Reset to world recall."
      );
      return;
    }
    logger.debug(`userLogoutHandler has room ${room.name}`);

    //remove user from location
    room.removeEntityFrom("users", user);
    worldEmitter.emit("zoneManagerRemovedUser", user);
  };

  placeUserRequestHandler = async (user: IUser) => {
    this.placeUserInLocation(user);
  };

  zoneRequestedHandler = async (zoneId: mongoose.Types.ObjectId) => {
    try {
      const zone = this.addZoneById(zoneId);
      worldEmitter.emit(`zone${zoneId.toString()}Loaded`, zone);
    } catch (err: any) {
      logger.error(`Error in zoneRequestedHandler: ${err.message}`);
    }
  };

  async addZoneById(id: mongoose.Types.ObjectId): Promise<IZone | null> {
    try {
      if (this.zones.has(id.toString())) {
        return this.getZoneById(id);
      }
      const zone: IZone | null = await Zone.findById(id);
      //if zone exists and isn't already in zones map
      if (!zone) {
        logger.error(`addZoneById couldn't get a zone with id ${id}`);
        return null;
      }

      // add zone to zones map
      this.zones.set(zone._id.toString(), zone);
      logger.info(`zoneManager added ${zone.name} to zones.`);
      logger.log(
        `loadout`,
        `Rooms in zone "${zone.name}": ${zone.rooms.map((room) => room.name)}.`
      );
      logger.log(
        `loadout`,
        `Active zones: ${JSON.stringify(
          Array.from(this.zones.values()).map((zone) => zone.name)
        )}`
      );
      await zone.initRooms();
      return zone;
    } catch (err: any) {
      logger.error(`Error in addZoneById: ${err.message}`);
      throw err;
    }
  }

  getZoneById(id: mongoose.Types.ObjectId) {
    try {
      const zone = this.zones.get(id.toString());
      if (zone) {
        return zone;
      } else {
        logger.error(`zoneManager can't find zone with id: ${id}.`);
        return null;
      }
    } catch (err: any) {
      logger.error(`Error in getZoneById: ${err.message}`);
      throw err;
    }
  }

  async placeUserInLocation(user: IUser) {
    if (!user) {
      logger.error(`placeUserInLocation received an undefined user`);
      return;
    }

    // Reset user location if necessary
    if (!user.location.inRoom || !user.location.inZone) {
      let resetLoc: ILocation | undefined = await resetUserLocation(
        user,
        "User location missing, reset to worldRecall."
      );
      if (resetLoc) {
        user.location = resetLoc;
      }
    }

    // Load zone if necessary
    let zone = this.zones.get(user.location.inZone.toString());
    if (!zone) {
      let resetLoc: ILocation | undefined = await resetUserLocation(
        user,
        "User location missing, reset to worldRecall."
      );
      if (resetLoc) {
        user.location = resetLoc;
      }
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
      let resetLoc: ILocation | undefined = await resetUserLocation(
        user,
        "User location missing, reset to worldRecall."
      );
      if (resetLoc) {
        user.location = resetLoc;
      }
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
  }

  async removeZoneById(id: mongoose.Types.ObjectId) {
    try {
      const zone = this.zones.get(id.toString());
      if (zone) {
        //TODO how to declare .clearRooms() in IZone interface? or should I run this some other way? Is initRooms(zoneToInit) its own function?
        await zone.clearRooms();
        logger.debug(`Removing zone "${zone.name}" from zones...`);
        this.zones.delete(id.toString());
        logger.debug(
          `Active zones: ${JSON.stringify(
            Array.from(this.zones.values()).map((zone) => zone.name)
          )}`
        );
      } else {
        logger.warn(`Zone with id ${id} does not exist in zones.`);
      }
    } catch (err: any) {
      logger.error(`Error in removeZoneById: ${err.message}`);
      throw err;
    }
  }

  clearContents() {
    this.zones.clear();
    worldEmitter.off("socketDisconnectedUser", this.userLogoutHandler);
    worldEmitter.off("placeUserRequest", this.placeUserRequestHandler);
    worldEmitter.off("zoneRequested", this.zoneRequestedHandler);
  }
}

export default ZoneManager;
