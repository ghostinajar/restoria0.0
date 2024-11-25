import { Types } from "mongoose";
const WORLD_RECALL = {
    inZone: new Types.ObjectId(process.env.WORLD_RECALL_ZONEID),
    inRoom: new Types.ObjectId(process.env.WORLD_RECALL_ROOMID),
};
export default WORLD_RECALL;
