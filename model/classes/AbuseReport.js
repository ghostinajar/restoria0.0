import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const abuseReportSchema = new Schema({
    reportingUser: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reportedUser: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    body: String,
  });

const AbuseReport = model('AbuseReport', abuseReportSchema);
export default AbuseReport;