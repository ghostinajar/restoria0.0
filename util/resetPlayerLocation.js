import logger from "../logger.js";

const resetPlayerLocation = async (player, message) => {
    logger.error(message);
    player.location = process.env.WORLD_RECALL;
    await player.save();
    return player.location;
}

export default resetPlayerLocation;