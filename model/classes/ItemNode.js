// ItemNode
import mongoose from "mongoose";
const { Schema } = mongoose;
const itemNodeSchema = new Schema({
    loadsItemBlueprintId: {
        type: Schema.Types.ObjectId,
        ref: "ItemBlueprint",
    },
    fromZoneId: {
        type: Schema.Types.ObjectId,
        ref: "Zone",
    },
});
export default itemNodeSchema;
