import mongoose from 'mongoose';

const { Schema, Types, model } = mongoose;

export interface IAbuseReport {
    reportingUser: mongoose.Schema.Types.ObjectId;
    reportedUser: mongoose.Schema.Types.ObjectId;
    body: string;
}

const abuseReportSchema = new Schema<IAbuseReport>({
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

const AbuseReport = model<IAbuseReport>('AbuseReport', abuseReportSchema);
export default AbuseReport;