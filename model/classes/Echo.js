import mongoose from 'mongoose';

const { Schema } = mongoose;

const echoSchema = new Schema({
    echoToOriginRoom: String,
    echoToDestinationRoom: String,
    echoToUser: String,
});

export default echoSchema;