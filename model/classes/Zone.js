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
//TODO update this method now that these entities are all stored in arrays, not maps?
// zoneSchema.methods.createEntityIn = async function (entityType, entity) {
//     if(this[entityType]) {
//         try {
//             // give subdocument an ObjectId
//             const entityId = new mongoose.Types.ObjectId();
//             entity._id = entityId;
//             // function to report creation success
//             const creationReport = () => {
//                 logger.info(`Zone "${this.name}" created "${entity.name}" in "${entityType}".`);
//             };
//             // create the entity
//             switch (entityType) {
//                 case 'itemBlueprints' : {
//                     this.itemBlueprints.pu(entity._id.toString(), entity);
//                     creationReport();
//                     break;
//                 }
//                 case 'mobBlueprints' : {
//                     this.mobBlueprints.set(entity._id.toString(), entity);
//                     creationReport();
//                     break;
//                 }
//                 case 'rooms' : {
//                     // If newRoomCoords match an existing room's, set new room's coords to [] and notify user
//                     if(entity.mapCoords) {
//                     const newRoomCoords = JSON.stringify(entity.mapCoords);
//                         for (let room of this.rooms.values()) {
//                             if (JSON.stringify(room.mapCoords) === newRoomCoords) {
//                                 entity.mapCoords = []
//                                 // TODO notify User their new room's duplicate coords were wiped
//                             }
//                         }
//                     };
//                     this.rooms.set(entity._id.toString(), entity);
//                     creationReport();
//                     break;
//                 }
//                 case 'suggestions' : {
//                     this.suggestions.set(entity._id.toString(), entity);
//                     creationReport();
//                     break;
//                 }
//             }
//             return await this.save();
//         } catch(err) {
//             logger.error(`Error in createEntity: ${err.message} for zone "${this.name}"`);
//             throw(err);
//         }
//     }
// }
zoneSchema.methods.clearRooms = async function () {
    try {
        // Clear each room's contents
        for (const room of this.rooms.values()) {
            // Assuming each room has a method to clear its contents
            //logger.debug(`Clearing contents of room "${room.name}"`)
            await room.clearContents();
        }
    }
    catch (err) {
        logger.error(`Error in zoneSchema.methods.clearRooms(): ${err.message}`);
        throw err;
    }
};
const Zone = mongoose.model("Zone", zoneSchema);
export default Zone;
