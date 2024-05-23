import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import locationSchema from './Location.js';
import descriptionSchema from './Description.js';

const { Schema, model } = mongoose;

// the user (aka "Author") lacks most of the data/methods of a character, 
// but is playable, and stores the user's auth info
const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // as a salted hash
    salt: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    isTeacher: { type: Boolean, default: false },
    location: locationSchema,
    pronouns: Number, // 0 = it/it, 1 = he/him, 2 = she/her, 3 = they/them
    creationDate: {
        type: Date,
        default: Date.now
    },
    lastLoginDate: Date,
    hoursPlayed: { type: Number, default: 0 },
    description: descriptionSchema,
    characters: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Character'
        }
    ],
    students: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (err) {
        throw err;
    }
};

const User = model('User', userSchema);
export default User;