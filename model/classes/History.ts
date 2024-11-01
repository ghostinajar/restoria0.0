import mongoose from 'mongoose';
import COMPLETION_STATUS from '../../constants/COMPLETION_STATUS.js';

const { Schema } = mongoose;

export interface IHistory {
    creationDate: Date;
    modifiedDate: Date;
    completionStatus: String;
    completionDate?: Date;
}

export function historyStartingNow() {
    return {
        creationDate: new Date(),
        modifiedDate: new Date(),
        completionStatus: COMPLETION_STATUS.DRAFT,
      }
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