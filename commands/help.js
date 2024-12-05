// help
// shows the user information about a game command or concept
import HELP from "../constants/HELP.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import htmlTableOfContentsForKeysOfObject from "../util/htmlTableOfContentsForKeysOfObject.js";
import makeMessage from "../util/makeMessage.js";
function help(parsedCommand, user) {
    try {
        if (!parsedCommand.directObject) {
            const helpContents = htmlTableOfContentsForKeysOfObject(HELP);
            worldEmitter.emit(`safeMessageFor${user.username}`, makeMessage(`help`, helpContents));
            worldEmitter.emit(`safeMessageFor${user.username}`, makeMessage(`help`, `What would you like help with? E.g. HELP CREATE`));
            return;
        }
        let target = parsedCommand.directObject;
        if (parsedCommand.string) {
            target = `${parsedCommand.directObject} ${parsedCommand.string}`;
        }
        target = target.replace(/ /g, "_");
        switch (target.toLowerCase()) {
            case `aggressive`:
                target = `aggressive_mob`;
                break;
            case `character`:
            case `user`:
                target = `author`;
                break;
            case `bugs`:
                target = `bug`;
                break;
            case `capacity`:
                target = `container`;
                break;
            case `room`:
                target = `create_room`;
                break;
            case `edit_zone`:
            case `zone`:
                target = `create_zone`;
                break;
            case `look`:
            case `examine`:
            case `study`:
            case `research`:
                target = `description`;
                break;
            case `delete`:
            case `erase_item`:
            case `delete_item`:
            case `erase_mob`:
            case `delete_mob`:
            case `erase_room`:
            case `delete_room`:
            case `erase_user`:
            case `delete_user`:
            case `erase_zone`:
            case `delete_zone`:
                target = `erase`;
                break;
            case `ex`:
            case `edit_room_exits`:
                target = `exits`;
                break;
            case `hidden_item`:
            case `hidden_user`:
            case `hidden_mob`:
            case `hidden_exit`:
                target = `hidden`;
                break;
            case `item_spell`:
                target = `item_spell_properties`;
                break;
            case `armor`:
            case `potion`:
            case `scroll`:
            case `token`:
            case `treasure`:
            case `wand`:
            case `fishing_rod`:
                target = `item_type`;
                break;
            case `fixture`:
            case `food`:
            case `lamp`:
            case `temporary`:
                target = `item_tag`;
                break;
            case `keyword`:
            case `key_word`:
            case `key_words`:
                target = `keywords`;
                break;
            case `hp`:
            case `health`:
            case `mp`:
            case `mana`:
            case `magic`:
            case `mv`:
            case `movement`:
            case `str`:
            case `strength`:
            case `dex`:
            case `dexterity`:
            case `con`:
            case `constitution`:
            case `int`:
            case `intelligence`:
            case `wis`:
            case `wisdom`:
            case `spi`:
            case `spirit`:
                target = `stats`;
                break;
            case `finesse`:
            case `finesse_weapon`:
            case `light_weapon`:
            case `reach`:
            case `reach_weapon`:
            case `range`:
            case `range_weapon`:
            case `ranged`:
            case `ranged_weapon`:
            case `twohand`:
            case `two_hand`:
            case `twohand_weapon`:
            case `two_hand_weapon`:
                target = `weapon_properties`;
                break;
            case `unique`:
                target = `unique_mob`;
                break;
            default:
                break;
        }
        if (!HELP.hasOwnProperty(target.toUpperCase())) {
            target = target.replace(/_/g, " ");
            worldEmitter.emit(`messageFor${user.username}`, makeMessage(`rejection`, `Sorry, there's no help available yet for ${target}.`));
            return;
        }
        let stringArray = HELP[target.toUpperCase()];
        let helpArray = [];
        stringArray.forEach((string) => {
            helpArray.push(makeMessage("help", string));
        });
        worldEmitter.emit(`safeMessageArrayFor${user.username}`, helpArray);
    }
    catch (error) {
        catchErrorHandlerForFunction(`help`, error, user?.name);
    }
}
export default help;
