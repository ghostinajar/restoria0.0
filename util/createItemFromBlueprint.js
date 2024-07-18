import mongoose from 'mongoose';
async function createItemFromBlueprint(blueprint) {
    // Create a copy of the blueprint and give its own unique Id
    const item = JSON.parse(JSON.stringify(blueprint));
    item._id = new mongoose.Types.ObjectId();
    item.history = {
        creationDate: Date.now,
    };
    item.itemNodes = null;
    //logger.log(`loadout`, `createItemFromBlueprint: ${item.name}`);
    return item;
}
export default createItemFromBlueprint;
