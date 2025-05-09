// ZoneManager
import logger from "../../logger.js";
import Zone from "./Zone.js";
import worldEmitter from "./WorldEmitter.js";
import mongoose from "mongoose";
import catchErrorHandlerForFunction from "../../util/catchErrorHandlerForFunction.js";
import relocateUser from "../../util/relocateUser.js";
import WORLD_RECALL from "../../constants/WORLD_RECALL.js";
import { DEFAULT_GOBLIN } from "../../constants/DEFAULT_GOBLIN.js";
import { DEFAULT_APPLE } from "../../constants/DEFAULT_APPLE.js";
class ZoneManager {
    constructor() {
        this.zones = new Map();
        worldEmitter.on("closeZoneRequested", this.closeZoneRequestedHandler);
        worldEmitter.on("placeUserRequest", this.placeUserRequestHandler);
        worldEmitter.on("roomRequested", this.roomRequestedHandler);
        worldEmitter.on("roomSummaryRequested", this.roomSummaryRequestedHandler);
        worldEmitter.on("socketDisconnectedUser", this.userLogoutHandler);
        worldEmitter.on("zoneRequested", this.zoneRequestedHandler);
    }
    zones;
    closeZoneRequestedHandler = async (zoneId) => {
        try {
            await this.removeZoneById(new mongoose.Types.ObjectId(zoneId));
            worldEmitter.emit(`zone${zoneId}Closed`, true);
            return true;
        }
        catch (error) {
            catchErrorHandlerForFunction(`ZoneManager.closeZoneRequestedHandler`, error);
            return false;
        }
    };
    roomRequestedHandler = async (location) => {
        try {
            let zone = await this.getZoneById(location.inZone);
            const room = zone?.rooms.find((room) => room._id.toString() === location.inRoom.toString());
            if (!room) {
                logger.error(`roomRequestedHandler got an undefined room for location ${JSON.stringify(location)}`);
                return;
            }
            worldEmitter.emit(`zoneManagerReturningRoom${room._id.toString()}`, room);
        }
        catch (error) {
            catchErrorHandlerForFunction("ZoneManager.roomRequestedHandler", error);
        }
    };
    roomSummaryRequestedHandler = async () => {
        try {
            let summary = [];
            // Iterate through each zone
            for (const [_, zone] of this.zones) {
                summary.push(`\nOccupied Rooms in zone ${zone.name} (${zone._id}):`);
                // Iterate through each room in the zone
                for (const room of zone.rooms) {
                    if (room.inventory.length > 0 ||
                        room.mobs.length > 0 ||
                        room.users.length > 0) {
                        summary.push(`${room.name} (${room._id}):`);
                    }
                    if (room.inventory.length > 0) {
                        summary.push(`  Items: ${room.inventory
                            .map((item) => `${item.name} (${item._id})`)
                            .join(", ") || "none"}`);
                    }
                    if (room.mobs.length > 0) {
                        summary.push(`  Mobs: ${room.mobs.map((mob) => `${mob.name} (${mob._id})`).join(", ") ||
                            "none"}`);
                    }
                    if (room.users.length > 0) {
                        summary.push(`  **USERS**: ${room.users
                            .map((user) => `${user.name} (${user._id})`)
                            .join(", ") || "none"}`);
                    }
                }
            }
            if (summary.length === 0) {
                logger.info("No active zones found.");
            }
            else {
                logger.info(summary.join("\n"));
            }
        }
        catch (error) {
            catchErrorHandlerForFunction(`ZoneManager.roomSummaryRequestedHandler`, error);
        }
    };
    userLogoutHandler = async (user) => {
        try {
            // find (or reset) user's location on logout
            let { inRoom, inZone } = user.location;
            let zone = this.zones.get(inZone.toString());
            if (!zone) {
                logger.error("User location zone not found at logout! Reset to world recall.");
                await relocateUser(user, WORLD_RECALL);
                return;
            }
            let room = zone.rooms.find((room) => room._id.toString() == inRoom.toString());
            if (!room) {
                logger.error("User location room not found at logout! Reset to world recall.");
                await relocateUser(user, WORLD_RECALL);
                return;
            }
            //remove user from location
            room.removeEntityFrom("users", user);
            worldEmitter.emit("zoneManagerRemovedUser", user);
        }
        catch (error) {
            catchErrorHandlerForFunction("ZoneManager.userLogoutHandler", error);
        }
    };
    placeUserRequestHandler = async (user) => {
        this.placeUserInStoredLocation(user);
    };
    zoneRequestedHandler = async (zoneId) => {
        try {
            let zone = await this.getZoneById(zoneId);
            if (!zone) {
                logger.error(`zoneManager.zoneRequestedHandler failed to return zone id ${zoneId}`);
                return;
            }
            worldEmitter.emit(`zone${zoneId.toString()}Loaded`, zone);
        }
        catch (error) {
            catchErrorHandlerForFunction(`ZoneManager.zoneRequestedHandler`, error);
        }
    };
    async addZoneById(id) {
        try {
            //load from db
            const zone = await Zone.findById(id);
            if (!zone) {
                logger.error(`zoneManager.addZoneById couldn't get a zone with id ${id} from db`);
                return undefined;
            }
            // add to zones map
            this.zones.set(zone._id.toString(), zone);
            logger.info(`zoneManager added ${zone.name} to zones.`);
            logger.info(`active zones in zoneManager: ${JSON.stringify(Array.from(this.zones.values()).map((zone) => zone.name))}`);
            // if blueprints are empty, add dummy data (necessary for user forms)
            if (zone.itemBlueprints.length === 0) {
                zone.itemBlueprints = [{ ...DEFAULT_APPLE }];
            }
            if (zone.mobBlueprints.length === 0) {
                zone.mobBlueprints = [{ ...DEFAULT_GOBLIN }];
            }
            await zone.initRooms();
            return zone;
        }
        catch (error) {
            catchErrorHandlerForFunction(`ZoneManager.addZoneById`, error);
        }
    }
    async getZoneById(id) {
        try {
            let zone = this.zones.get(id.toString());
            if (!zone) {
                zone = await this.addZoneById(id);
            }
            if (!zone) {
                logger.error(`ZoneManager.getZoneById can't find zone with id: ${id}.`);
                return null;
            }
            return zone;
        }
        catch (error) {
            catchErrorHandlerForFunction(`ZoneManager.getZoneById`, error);
        }
    }
    async placeUserInStoredLocation(user) {
        try {
            if (!user) {
                logger.error(`placeUserInStoredLocation received an undefined user`);
                return;
            }
            // Reset user location if necessary
            if (!user.location.inRoom || !user.location.inZone) {
                logger.error("User location missing, reset to worldRecall.");
                await relocateUser(user, WORLD_RECALL);
            }
            // Load zone if necessary
            let zone = await this.getZoneById(user.location.inZone);
            if (!zone) {
                logger.error("User location missing, reset to worldRecall.");
                await relocateUser(user, WORLD_RECALL);
                zone = this.zones.get(user.location.inZone.toString());
            }
            // If zone still doesn't exist, log error and return
            if (!zone) {
                logger.error(`Couldn't reset user location. Failed to place user.`);
                return;
            }
            // Find room in the zone
            let room = zone.rooms.find((room) => room._id.toString() == user.location.inRoom.toString());
            // If room doesn't exist, reset user location and try to find the room again
            if (!room) {
                logger.error("User location missing, reset to worldRecall.");
                await relocateUser(user, WORLD_RECALL);
                zone = this.zones.get(user.location.inZone.toString());
                room = zone?.rooms.find((room) => room._id.toString() == user.location.inRoom.toString());
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
        catch (error) {
            catchErrorHandlerForFunction("ZoneManager.placeUserInStoredLocation", error);
        }
    }
    async removeZoneById(id) {
        try {
            const zone = this.zones.get(id.toString());
            if (zone) {
                await zone.clearRooms();
                this.zones.delete(id.toString());
                logger.info(`Zonemanager closed zone id ${id}.`);
            }
            else {
                logger.info(`Zonemanager tried to close zone id ${id}, but it wasn't even loaded in zones.`);
            }
        }
        catch (error) {
            catchErrorHandlerForFunction(`ZoneManager.removeZoneById`, error);
        }
    }
    clearContents() {
        this.zones.clear();
        worldEmitter.off("closeZoneRequested", this.closeZoneRequestedHandler);
        worldEmitter.off("placeUserRequest", this.placeUserRequestHandler);
        worldEmitter.off("roomRequested", this.roomRequestedHandler);
        worldEmitter.off("roomSummaryRequested", this.roomSummaryRequestedHandler);
        worldEmitter.off("socketDisconnectedUser", this.userLogoutHandler);
        worldEmitter.off("zoneRequested", this.zoneRequestedHandler);
    }
}
export default ZoneManager;
