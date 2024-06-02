import Name from './Name.js'
import logger from '../../logger.js';

async function checkDuplicateName(name) {
    try {
        let nameIsDuplicate = false;
        nameIsDuplicate = !!(await Name.findOne({ username: name.toLowerCase() }));
        if (nameIsDuplicate) {
            logger.info(`Duplicate name prevented: ${name}`)        
        }
        return nameIsDuplicate;
    } catch (err) {
        logger.error(`checkDuplicateName encountered an error: ${err.message}`);
        throw err;
    }
}

export default checkDuplicateName;
