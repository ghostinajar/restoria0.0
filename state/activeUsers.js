// Map of active user instances playing the game
let activeUsers = new Map();

function addUser(userId, userData, parentId) {
    userData.parentId = parentId;
    activeUsers.set(userId, userData);
}

function moveUser(userId, newParentId) {
    let userData = activeUsers.get(userId);
    if (userData) {
        userData.parentId = newParentId;
    }
}

export default { activeUsers, addUser, moveUser };