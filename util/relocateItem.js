import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
async function relocateItem(item, originInventory, destinationInventory) {
    try {
        destinationInventory.push(item);
        originInventory.splice(originInventory.indexOf(item), 1);
    }
    catch (error) {
        catchErrorHandlerForFunction(`relocateItem`, error);
    }
}
export default relocateItem;
