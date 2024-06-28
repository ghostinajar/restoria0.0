import mongoose from "mongoose";
import historySchema, { IHistory } from "./History.js";
import descriptionSchema, { IDescription } from "./Description.js";
import roomSchema, { IRoom } from "./Room.js";
import mobBlueprintSchema, { IMobBlueprint } from "./MobBlueprint.js";
import itemBlueprintSchema, { IItemBlueprint } from "./ItemBlueprint.js";
import suggestionSchema, { ISuggestion } from "./Suggestion.js";
import logger from "../../logger.js";

const { Schema } = mongoose;

export interface IZone extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  name: string;
  history: IHistory;
  description: IDescription;
  rooms: Array<IRoom>;
  mobBlueprints: Array<IMobBlueprint>;
  itemBlueprints: Array<IItemBlueprint>;
  suggestions: Array<ISuggestion>;
  minutesToRepop: number;

  initRooms(): Promise<void>;
  clearRooms(): Promise<void>;
}

const zoneSchema = new Schema({
  _id: Schema.Types.ObjectId,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  name: String,
  history: {
    type: historySchema,
    default: () => ({}),
  },
  description: {
    type: descriptionSchema,
    default: () => ({}),
  },
  rooms: [
    {
      type: roomSchema,
      default: () => [],
    },
  ],
  mobBlueprints: [
    {
      type: mobBlueprintSchema,
      default: () => [],
    },
  ],
  itemBlueprints: [
    {
      type: itemBlueprintSchema,
      default: () => [],
    },
  ],
  suggestions: [
    {
      type: suggestionSchema,
      default: () => ({}),
    },
  ],
  minutesToRepop: {
    type: Number,
    default: 15,
    min: [
      5,
      "The value of `{PATH}` (`{VALUE}`) is beneath the limit of `{MIN}`.",
    ],
    max: [
      120,
      "The value of `{PATH}` (`{VALUE}`) exceeds the limit of `{MAX}`.",
    ],
  },
});

zoneSchema.methods.initRooms = async function () {
  try {
    //instantiate room instances
    for (const room of this.rooms) {
      await room.initiate(); //setup room's contents arrays (inventory, mobs, users)
    }
    return;
  } catch (err: any) {
    logger.error(`Error in addRooms: ${err.message}`);
    throw err;
  }
};

zoneSchema.methods.clearRooms = async function () {
  try {
    // Clear each room's contents
    for (const room of this.rooms.values()) {
      // Assuming each room has a method to clear its contents
      logger.debug(`Clearing contents of room "${room.name}"`)
      await room.clearContents();
    }
  } catch (err: any) {
    logger.error(`Error in zoneSchema.methods.clearRooms(): ${err.message}`);
    throw err;
  }
};

const Zone = mongoose.model("Zone", zoneSchema);

export default Zone;
