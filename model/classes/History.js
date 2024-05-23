import mongoose from 'mongoose';
import COMPLETION_STATUS from '../../constants/COMPLETION_STATUS.js';

const { Schema } = mongoose;

const historySchema = new Schema({
    creationDate: {
        type: Date,
        default: Date.now,
    },
    modifiedDate: {
        type: Date,
        default: Date.now,
    },
    completionStatus: {
        type: String,
        default: COMPLETION_STATUS.DRAFT,
    },
    completionDate: Date,
}, { _id: false });

export default historySchema;