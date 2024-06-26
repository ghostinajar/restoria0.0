import mongoose from 'mongoose';
import COMPLETION_STATUS from '../../constants/COMPLETION_STATUS.js';

const { Schema } = mongoose;

export interface IHistory {
    creationDate: Date;
    modifiedDate: Date;
    completionStatus: String;
    completionDate?: Date;
}

const historySchema = new Schema<IHistory>({
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