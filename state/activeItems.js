// Map of active item instances popped in the game
let activeItems = new Map();

function addItem(itemId, itemData, parentId) {
    itemData.parentId = parentId;
    activeItems.set(itemId, itemData);
}

function moveItem(itemId, newParentId) {
    let itemData = activeItems.get(itemId);
    if (itemData) {
        itemData.parentId = newParentId;
    }
}

export default { activeItems, addItem, moveItem };