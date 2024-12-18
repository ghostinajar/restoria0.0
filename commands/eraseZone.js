// eraseZone
// 
import mongoose from "mongoose";
import logger from "../logger.js";
import User from "../model/classes/User.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import makeMessage from "../util/makeMessage.js";
import Zone from "../model/classes/Zone.js";
import Name from "../model/classes/Name.js";
async function eraseZone(zoneId, user) {
    try {
        // Authenticate (admin only)
        if (!user.isAdmin) {
            logger.warn(`User ${user._id} (${user.name} submitted erase_zone_form successfully on zone id ${zoneId}. How?)`);
            worldEmitter.emit(`messageFor${user.username}`, makeMessage(`rejection`, `You aren't authorized to submit 'erase zone'. Your attempt has been logged.`));
            return;
        }
        // Verify valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(zoneId)) {
            logger.warn(`Invalid zone ID format submitted: ${zoneId}`);
            worldEmitter.emit(`messageFor${user.username}`, makeMessage(`rejection`, `Sorry, that's an invalid id.`));
            return;
        }
        const zoneObjectId = new mongoose.Types.ObjectId(zoneId);
        // Verify zone still exists
        const zone = await Zone.findById(zoneObjectId);
        if (!zone) {
            logger.warn(`userSubmittedEraseZoneHandler tried to delete a non-existent zone ${zoneId}`);
            worldEmitter.emit(`messageFor${user.username}`, makeMessage(`rejection`, `Zone not found.`));
            return;
        }
        // Empty zone of users
        let zoneEmptiedOfUsers = await new Promise((resolve) => {
            worldEmitter.once(`zone${zoneId}EmptiedOfUsers`, resolve);
            worldEmitter.emit(`emptyZoneOfUsersRequested`, zoneId);
        });
        if (!zoneEmptiedOfUsers) {
            logger.warn(`userSubmittedEraseZoneHandler failed, couldn't empty zone of users`);
            worldEmitter.emit(`messageFor${user.username}`, makeMessage(`rejection`, `Failed to safely remove all users from zone.`));
            return;
        }
        // Close zone
        let zoneClosed = await new Promise((resolve) => {
            worldEmitter.once(`zone${zoneId}Closed`, resolve);
            worldEmitter.emit(`closeZoneRequested`, zoneId);
        });
        if (!zoneClosed) {
            logger.warn(`userSubmittedEraseZoneHandler failed, couldn't close zone in zoneManager`);
            worldEmitter.emit(`messageFor${user.username}`, makeMessage(`rejection`, `Failed to safely close zone.`));
            return;
        }
        const zoneAuthor = await User.findById(zone.author);
        if (!zoneAuthor) {
            logger.warn(`eraseZone couldn't find the author of zone ${zoneId}.`);
        }
        if (zoneAuthor) {
            zoneAuthor.unpublishedZoneTally--;
        }
        // Delete name from reserved Names
        if (zone.name) {
            let nameDeleted = await Name.deleteOne({ name: zone.name.toString().toLowerCase() });
            logger.info(`${nameDeleted} deleted from reserved Names.`);
        }
        // Delete zone from database
        try {
            await Zone.findByIdAndDelete(zoneObjectId);
        }
        catch (dbError) {
            logger.error(`Database error deleting zone ${zoneId}: ${dbError}`);
            worldEmitter.emit(`messageFor${user.username}`, makeMessage(`rejection`, `Database error occurred while deleting zone.`));
            return;
        }
        // Step 4: Notify success
        logger.info(`Zone ${zoneId} successfully deleted by admin ${user.name}.`);
        worldEmitter.emit(`messageFor${user.username}`, makeMessage(`success`, `You successfully erased zone ${zoneId}`));
    }
    catch (error) {
        catchErrorHandlerForFunction(`eraseZone`, error, user?.name);
    }
}
export default eraseZone;
