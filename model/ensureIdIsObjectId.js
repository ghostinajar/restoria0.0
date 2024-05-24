import mongoose from 'mongoose';

function ensureIdIsObjectId(id) {
    if (typeof id === 'string') {
        id = new mongoose.Types.ObjectId(id);
    }
}

export default ensureIdIsObjectId;