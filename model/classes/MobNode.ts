// MobNode
import mongoose from "mongoose";

const { Schema } = mongoose;

export interface IMobNode {
  _id?: mongoose.Types.ObjectId;
  loadsMobBlueprintId: mongoose.Types.ObjectId;
  fromZoneId: mongoose.Types.ObjectId;
}

const mobNodeSchema = new Schema<IMobNode>({
  loadsMobBlueprintId: {
    type: Schema.Types.ObjectId,
    ref: "MobBlueprint",
  },
  fromZoneId: {
    type: Schema.Types.ObjectId,
    ref: "Zone",
  },
});

export default mobNodeSchema;
