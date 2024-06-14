// resetUserLocation
import logger from "../logger.js";
import mongoose from "mongoose";
const resetUserLocation = async (user, message) => {
    logger.error(message);
    user.location.inRoom = new mongoose.Types.ObjectId(process.env.WORLD_RECALL_ROOMID);
    user.location.inZone = new mongoose.Types.ObjectId(process.env.WORLD_RECALL_ZONEID);
    await user.save();
    return user.location;
};
export default resetUserLocation;
