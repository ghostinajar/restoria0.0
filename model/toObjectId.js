const mongoose = require('mongoose');

function toObjectId(id) {
    if (mongoose.Types.ObjectId.isValid(id)) {
        return new mongoose.Types.ObjectId(id);
    } else {
        throw new Error('Invalid id');
    }
}

export default toObjectId;