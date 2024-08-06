// ItemNode
import mongoose from "mongoose";

const { Schema } = mongoose;

export interface IItemNode {
  loadsItemBlueprintId: mongoose.Types.ObjectId;
  fromZoneId: mongoose.Types.ObjectId;
}

const itemNodeSchema = new Schema<IItemNode>({
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
