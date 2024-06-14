// resetUserLocation
import logger from "../logger.js";
import User, { IUser } from "../model/classes/User.js";
import mongoose from "mongoose";

const resetUserLocation = async (user : mongoose.Document & IUser, message: string) => {
    logger.error(message);
    if (!process.env.WORLD_RECALL_ROOMID || !process.env.WORLD_RECALL_ZONEID) {
        logger.error(`No values in process.env.WORLD_RECALL_ROOMID or ..._ZONEID`);
        return;
    }
    user.location.inRoom = mongoose.Types.ObjectId.createFromHexString(process.env.WORLD_RECALL_ROOMID);
    user.location.inZone = mongoose.Types.ObjectId.createFromHexString(process.env.WORLD_RECALL_ZONEID);
    await user.save();
    return user.location;
}

export default resetUserLocation;
