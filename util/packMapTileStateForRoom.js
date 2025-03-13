// packMapTileStateForRoom
// packs a mapTileState for a given room
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
async function packMapTileStateForRoom(room) {
    try {
        const mapTileState = {
            mapCoords: room.mapCoords,
            mapTile: room.mapTile,
            walls: {
                north: "?",
                east: "?",
                south: "?",
                west: "?",
            },
        };
        // populate walls
        const directions = ["north", "east", "south", "west"];
        directions.forEach((direction) => {
            if (room.exits[direction]) {
                if (room.exits[direction].isClosed) {
                    mapTileState.walls[direction] = "closed";
                }
                else {
                    mapTileState.walls[direction] = "open";
                }
                if (room.exits[direction].hiddenByDefault) {
                    mapTileState.walls[direction] = "wall";
                }
            }
            else {
                mapTileState.walls[direction] = "wall";
            }
        });
        return mapTileState;
    }
    catch (error) {
        catchErrorHandlerForFunction(`packMapTileStateForRoom`, error);
    }
}
export default packMapTileStateForRoom;
