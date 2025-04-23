// wear
// user can WEAR an armor-type item to an appropriate slot
import WEARABLE_LOCATION, { WEARABLE_LOCATION_VALUES, } from "../constants/WEARABLE_LOCATION.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import messageToUsername from "../util/messageToUsername.js";
import save from "./save.js";
import unequip from "./unequip.js";
async function wear(item, user, location) {
    try {
        // Fail if armor has no wearable locations
        if (!item.wearableLocations ||
            !Object.values(item.wearableLocations).some(Boolean)) {
            messageToUsername(user.username, `The author of ${item.name} needs to add wearable locations.`, `rejection`);
            return;
        }
        // make an array and push the keys of the item.wearableLocations object into it if the value of that key is true
        const locationsItemIsWearable = item.wearableLocations
            ? Object.keys(item.wearableLocations).filter((location) => (item.wearableLocations ?? {})[location])
            : [];
        console.log(`item is wearable! locations:`);
        console.log(locationsItemIsWearable);
        // Fail if user and item aren't compatible (e.g. level, job, spirit)
        if (!checkItemCompatibilityWithUser(user, item)) {
            // NB checkItemCompatibilityWithUser already notified the user
            return;
        }
        console.log(`user and item are compatible!`);
        // Fail if indirect object is provided in parsedCommand but isn't a valid wearable location
        const fingerAndWristAbbrevs = ["f1", "f2", "w1", "w2"];
        if (location &&
            !WEARABLE_LOCATION_VALUES.some((l) => l.startsWith(location)) &&
            !fingerAndWristAbbrevs.includes(location)) {
            messageToUsername(user.username, `${location} isn't a place you can wear something.`, `help`);
            messageToUsername(user.username, `Read HELP EQUIP to find out more.`, `rejection`);
            return;
        }
        console.log(`indirect object is valid!`);
        // handle abbreviations of WEARABLE_LOCATION_VALUES
        let expandedLocation;
        if (location === "f1") {
            expandedLocation = WEARABLE_LOCATION.FINGER1;
        }
        if (location === "f2") {
            expandedLocation = WEARABLE_LOCATION.FINGER2;
        }
        if (location === "w1") {
            expandedLocation = WEARABLE_LOCATION.WRIST1;
        }
        if (location === "w2") {
            expandedLocation = WEARABLE_LOCATION.WRIST2;
        }
        if (location &&
            WEARABLE_LOCATION_VALUES.some((l) => l.startsWith(location))) {
            expandedLocation = WEARABLE_LOCATION_VALUES.find((l) => l.startsWith(location));
        }
        console.log(`specified location (expanded): ${expandedLocation}`);
        // Fail if user provided a valid location, but the item doesn't fit there
        if (expandedLocation &&
            !locationsItemIsWearable.some((location) => location === expandedLocation)) {
            messageToUsername(user.username, `You can't fit ${item.name} on your ${expandedLocation}.`, `rejection`);
            messageToUsername(user.username, `Try WEAR ${item.name} ${locationsItemIsWearable[0]}.`, `rejection`);
            return;
        }
        // for each property in user.equipped, if the value is null (nothing is worn there), push the key into locationsUserHasEmpty as a string
        const locationsUserHasEmpty = WEARABLE_LOCATION_VALUES.filter((location) => !user.equipped[location]);
        console.log(`user has empty locations:`);
        console.log(locationsUserHasEmpty);
        // if the user has specified an empty location, go ahead and equip the item there
        if (expandedLocation && locationsUserHasEmpty.includes(expandedLocation)) {
            moveItemToEquippedOnUser(user, item, expandedLocation);
            return;
        }
        // make a list of slots that are both empty and compatible
        const compatibleAndEmptyLocationsOnUser = locationsUserHasEmpty.filter((location) => locationsItemIsWearable.includes(location));
        console.log(`user has empty and compatible locations:`);
        console.log(compatibleAndEmptyLocationsOnUser);
        // if an empty && compatible slot exists, equip the item there
        if (compatibleAndEmptyLocationsOnUser.length > 0) {
            expandedLocation = compatibleAndEmptyLocationsOnUser[0];
            console.log(`user wanted ${item.name} on empty ${expandedLocation}, equipping...`);
            moveItemToEquippedOnUser(user, item, expandedLocation);
            return;
        }
        // at this point we've handled empty slots (either specified or not)
        // now we handle slots that are already occupied by items
        let locationToTry = expandedLocation || locationsItemIsWearable[0];
        console.log(`user wants ${item.name} on occupied ${locationToTry} slot...`);
        if (!locationToTry) {
            throw new Error(`Couldn't find locationToTry for ${item.name}.`);
        }
        const itemInSlot = user.equipped[locationToTry];
        if (!itemInSlot) {
            throw new Error(`Couldn't find itemInSlot for ${user.name}.`);
        }
        console.log(`item in slot: ${itemInSlot?.name} (${itemInSlot?._id}), unequipping...`);
        unequip({ commandWord: "unequip" }, user, itemInSlot, locationToTry);
        moveItemToEquippedOnUser(user, item, locationToTry);
        save(user, true);
    }
    catch (error) {
        catchErrorHandlerForFunction(`wear`, error, user?.name);
    }
}
// returns true if the item's level, job and spirit requirements are met by the user
function checkItemCompatibilityWithUser(user, item) {
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
// moves an item from inventory to an empty slot on character.equipped
function moveItemToEquippedOnUser(user, item, location) {
    user.equipped[location] = item;
    user.inventory = user.inventory.filter((i) => i._id !== item._id);
    messageToUsername(user.username, `You equipped ${item.name}.`, `itemIsHere`);
    console.log(`${user.name}'s ${location} now holds ${user.equipped[location]?.name} (${item._id})`);
}
export default wear;
