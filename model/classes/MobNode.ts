// MobNode
import mongoose from "mongoose";

const { Schema } = mongoose;

export interface IMobNode {
  _id?: mongoose.Types.ObjectId;
  loadsBlueprintId: mongoose.Types.ObjectId;
  fromZoneId: mongoose.Types.ObjectId;
}

const mobNodeSchema = new Schema<IMobNode>({
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
