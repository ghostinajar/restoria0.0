// Zone
import mongoose from "mongoose";
import historySchema from "./History.js";
import descriptionSchema from "./Description.js";
import roomSchema from "./Room.js";
import mobBlueprintSchema from "./MobBlueprint.js";
import itemBlueprintSchema from "./ItemBlueprint.js";
import suggestionSchema from "./Suggestion.js";
import logger from "../../logger.js";
const { Schema } = mongoose;
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
    }
    catch (err) {
        logger.error(`Error in addRooms: ${err.message}`);
        throw err;
    }
};
zoneSchema.methods.clearRooms = async function () {
    try {
        // Clear each room's contents
        for (const room of this.rooms.values()) {
            // Assuming each room has a method to clear its contents
            // logger.debug(`Clearing contents of room "${room.name}"`);
            await room.clearContents();
        }
    }
    catch (err) {
        logger.error(`Error in zoneSchema.methods.clearRooms(): ${err.message}`);
        throw err;
    }
};
zoneSchema.methods.eraseItemBlueprintById = async function (id) {
    try {
        this.itemBlueprints = this.itemBlueprints.filter((blueprint) => blueprint._id.toString() !== id.toString());
    }
    catch (err) {
        logger.error(`Error in zoneSchema.methods.eraseItemBlueprintById(): ${err.message}`);
    }
};
zoneSchema.methods.eraseMobBlueprintById = async function (id) {
    try {
        this.mobBlueprints = this.mobBlueprints.filter((blueprint) => blueprint._id.toString() !== id.toString());
    }
    catch (err) {
        logger.error(`Error in zoneSchema.methods.eraseMobBlueprintById(): ${err.message}`);
    }
};
zoneSchema.methods.eraseRoomById = async function (id) {
    try {
        this.rooms = this.rooms.filter((room) => room._id.toString() !== id.toString());
    }
    catch (err) {
        logger.error(`Error in zoneSchema.methods.eraseRoomById(): ${err.message}`);
    }
};
const Zone = mongoose.model("Zone", zoneSchema);
export default Zone;
