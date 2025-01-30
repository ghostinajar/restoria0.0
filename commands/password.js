// password
// allows user to change their password by entering new password twice
import worldEmitter from "../model/classes/WorldEmitter.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import makeMessage from "../util/makeMessage.js";
import saltAndHashPassword from "../util/saltAndHashPassword.js";
import help from "./help.js";
async function password(parsedCommand, user) {
    try {
        // fail if parsedCommand.string is empty
        if (!parsedCommand.string) {
<<<<<<< HEAD
            help({
                commandWord: "help",
                directObject: "password",
            }, user);
            worldEmitter.emit(`messageFor${user.username}`, makeMessage(`rejection`, `Please enter new password twice (e.g. "PASSWORD new14Password new14Password").`));
            return;
        }
        const passArray = parsedCommand.string.split(" ");
=======
            worldEmitter.emit(`messageFor${user.username}`, makeMessage(`rejection`, `Please enter new password twice (e.g. "PASSWORD new14Password new14Password").`));
            return;
        }
        console.log(`parsedCommand.string=${parsedCommand.string}`);
        const passArray = parsedCommand.string.split(" ");
        console.log(`passArray=${passArray}`);
>>>>>>> 5d683a3580be8f73d720d591425360e06e06778b
        // fail if passwords don't match
        if (passArray[0] !== passArray[1]) {
            help({
                commandWord: "help",
                directObject: "password",
            }, user);
            worldEmitter.emit(`messageFor${user.username}`, makeMessage(`rejection`, `Please enter new password twice (e.g. "PASSWORD waTerm3lon waTerm3lon").`));
            return;
        }
        // fail if password doesn't match passwordRequirements
        const passwordRequirements = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        if (!passArray[0].match(passwordRequirements)) {
            help({
                commandWord: "help",
                directObject: "password",
            }, user);
            worldEmitter.emit(`messageFor${user.username}`, makeMessage(`rejection`, `Password must be at least 8 characters long and contain at least one number, one lowercase letter, and one uppercase letter.`));
            return;
        }
        const encryptedPassword = await saltAndHashPassword(passArray[0]);
        if (!encryptedPassword) {
            help({
                commandWord: "help",
                directObject: "password",
            }, user);
            worldEmitter.emit(`messageFor${user.username}`, makeMessage(`rejection`, `Sorry, we failed to encrypt your password. We logged the bug, and Ralu will try to fix it ASAP.`));
            return;
        }
        // save new password and notify success
        user.password = encryptedPassword;
        await user.save();
        worldEmitter.emit(`messageFor${user.username}`, makeMessage(`success`, `Your password has been changed successfully.`));
    }
    catch (error) {
        catchErrorHandlerForFunction(`password`, error, user?.name);
    }
}
export default password;
