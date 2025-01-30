// saltAndHashPassword
import bcrypt from "bcrypt";
async function saltAndHashPassword(password) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    }
    catch (error) {
        console.error(`saltAndHashPassword failed to encrypt ${password}!`);
    }
}
export default saltAndHashPassword;
