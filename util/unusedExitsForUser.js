import getRoomOfUser from "./getRoomOfUser.js";
async function unusedExitsForUser(user) {
    //get user's room
    const room = await getRoomOfUser(user);
    // logger.debug(`unusedExitsForUser found user's room: ${room.name}`);
    let unusedExitsArray = [
        "north",
        "east",
        "south",
        "west",
        "up",
        "down",
    ];
    //iterate over room's used exits to filter from unusedExitsArray
    for (let [key, value] of Object.entries(room.exits)) {
        if (value &&
            key !== "$__parent" &&
            key !== "$__" &&
            key !== "$isNew" &&
            key !== "$__v" &&
            key !== "$_id" &&
            key !== "_doc") {
            switch (key) {
                case "north": {
                    unusedExitsArray = unusedExitsArray.filter((exit) => exit !== "north");
                    break;
                }
                case "east": {
                    unusedExitsArray = unusedExitsArray.filter((exit) => exit !== "east");
                    break;
                }
                case "south": {
                    unusedExitsArray = unusedExitsArray.filter((exit) => exit !== "south");
                    break;
                }
                case "west": {
                    unusedExitsArray = unusedExitsArray.filter((exit) => exit !== "west");
                    break;
                }
                case "up": {
                    unusedExitsArray = unusedExitsArray.filter((exit) => exit !== "up");
                    break;
                }
                case "down": {
                    unusedExitsArray = unusedExitsArray.filter((exit) => exit !== "down");
                    break;
                }
                default:
                    break;
            }
        }
    }
    return unusedExitsArray;
}
export default unusedExitsForUser;
