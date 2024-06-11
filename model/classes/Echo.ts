import mongoose from 'mongoose';

const { Schema } = mongoose;

export interface IEcho {
    echoToOriginRoom: String;
    echoToDestinationRoom: String;
    echoToUser: String;
}

const echoSchema = new Schema<IEcho>({
    echoToOriginRoom: String,
    echoToDestinationRoom: String,
    echoToUser: String,
}, { _id: false });

export default echoSchema;