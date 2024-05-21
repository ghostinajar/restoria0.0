import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const storedAbuseReportSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'StoredUser'
    },
    reportedUser: {
        type: Schema.Types.ObjectId,
        ref: 'StoredUser'
    },
    explanation: String,
  });

const StoredAbuseReport = model('StoredAbuseReport', storedAbuseReportSchema);
export default StoredAbuseReport;