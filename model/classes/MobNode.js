// MobNode
import mongoose from "mongoose";
const { Schema } = mongoose;
const mobNodeSchema = new Schema({
    loadsBlueprintId: {
        type: Schema.Types.ObjectId,
        ref: "MobBlueprint",
    },
    fromZoneId: {
        type: Schema.Types.ObjectId,
        ref: "Zone",
    },
});
export default mobNodeSchema;
