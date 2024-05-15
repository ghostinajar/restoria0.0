// Map of active mob instances popped in the game
let activeMobs = new Map();

function addMob(mobId, mobData, parentId) {
    mobData.parentId = parentId;
    activeMobs.set(mobId, mobData);
}

function moveMob(mobId, newParentId) {
    let mobData = activeMobs.get(mobId);
    if (mobData) {
        mobData.parentId = newParentId;
    }
}

export default { activeMobs, addMob, moveMob };