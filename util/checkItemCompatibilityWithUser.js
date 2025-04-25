import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
import messageToUsername from "./messageToUsername.js";
// returns true if the item's level, job and spirit requirements are met by the user
export function checkItemCompatibilityWithUser(user, item) {
    try {
        // fail if user's level isn't high enough
        if (user.level < item.minimumLevel) {
            messageToUsername(user.username, `You need to be at least level ${item.minimumLevel} to use this item.`, `rejection`, true);
            return false;
        }
        // fail if user's job isn't compatible with the item
        if ((user.job === "cleric" && !item.tags.cleric) ||
            (user.job === "mage" && !item.tags.mage) ||
            (user.job === "rogue" && !item.tags.rogue) ||
            (user.job === "warrior" && !item.tags.warrior)) {
            messageToUsername(user.username, `Sadly, ${item.name} can't be worn by ${user.job}s.`, `rejection`, false);
            return false;
        }
        // fail if the users's spirit is incompatible with the item
        if (user.statBlock.spirit > -333 && !item.tags.moon) {
            messageToUsername(user.username, `Your spirit is too moon-aligned to wear ${item.name}.`, `rejection`, false);
            return false;
        }
        if (user.statBlock.spirit > -333 &&
            user.statBlock.spirit < 333 &&
            !item.tags.neutral) {
            messageToUsername(user.username, `Your spirit is too neutral to wear ${item.name}.`, `rejection`, false);
            return false;
        }
        if (user.statBlock.spirit > 333 && !item.tags.sun) {
            messageToUsername(user.username, `Your spirit is too sun-aligned to wear ${item.name}.`, `rejection`, false);
            return false;
        }
        return true;
    }
    catch (error) {
        catchErrorHandlerForFunction(`checkItemCompatibilityWithUser`, error, user?.name);
        return false;
    }
}
export default checkItemCompatibilityWithUser;
