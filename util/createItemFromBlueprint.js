import mongoose from "mongoose";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
async function createItemFromBlueprint(blueprint) {
    try {
        // Create a copy of the blueprint and give its own unique Id
        const item = JSON.parse(JSON.stringify(blueprint));
        item.itemBlueprint = blueprint._id;
        item.fromZone = blueprint.fromZone;
        item._id = new mongoose.Types.ObjectId();
        item.history = {
            creationDate: Date.now,
        };
        item.itemNodes = null;
        return item;
    }
    catch (error) {
        catchErrorHandlerForFunction("createItemFromBlueprint", error);
    }
}
export default createItemFromBlueprint;
