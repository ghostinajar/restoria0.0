import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const abuseReportSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Author'
    },
    reportedUser: {
        type: Schema.Types.ObjectId,
        ref: 'Author'
    },
    explanation: String,
    commands: [String]
  });

const AbuseReport = model('AbuseReport', abuseReportSchema);
export default AbuseReport;