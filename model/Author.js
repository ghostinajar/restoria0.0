import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const authorSchema = new Schema({
    name: String,
    isAdmin: Boolean,
    email: String,
    password: String,
    location: {
        zoneId: String,
        roomId: String
    },
    pronouns: Number, // 0 = he/him, 1 = she/her, 2 = they/them, 3 = it/it
    creationDate: {
        type: Date,
        default: Date.now
    },
    lastLogin: Date,
    hoursPlayed: Number,
    description: {
        look: String,
        examine: String,
        study: String,
        research: String
    },
    characters: [
        {   
            name: String,
            pronouns: Number, // 0 = he/him, 1 = she/her, 2 = they/them, 3 = it/it
            creationDate: {
                type: Date,
                default: Date.now
            },
            hoursPlayed: Number,
            currentJob: String,
            strength: Number,
            dexterity: Number,
            constitution: Number,
            intelligence: Number,
            wisdom: Number,
            charisma: Number,
            spirit: Number,
            goldHeld: Number,
            goldBanked: Number,
            trainingPoints: Number,
            jobLevels: {
                cleric: Number,
                mage: Number,
                thief: Number,
                warrior: Number
            },
            description: {
                look: String,
                examine: String,
                study: String,
                research: String
            },
            trained: {
                passives: {
                    name: String,
                    level: Number
                },
                spells: {
                    name: String,
                    level: Number
                },
            },
            inventory: [
                {
                    type: Schema.Types.ObjectId,
                    ref: 'ItemInstance'
                }
            ],
            equipped: {
                arms: {
                    type: Schema.Types.ObjectId,
                    ref: 'ItemInstance'
                },
                body: {
                    type: Schema.Types.ObjectId,
                    ref: 'ItemInstance'
                },
                ears: {
                    type: Schema.Types.ObjectId,
                    ref: 'ItemInstance'
                },
                feet: {
                    type: Schema.Types.ObjectId,
                    ref: 'ItemInstance'
                },
                finger1: {
                    type: Schema.Types.ObjectId,
                    ref: 'ItemInstance'
                },
                finger2: {
                    type: Schema.Types.ObjectId,
                    ref: 'ItemInstance'
                },
                hands: {
                    type: Schema.Types.ObjectId,
                    ref: 'ItemInstance'
                },
                head: {
                    type: Schema.Types.ObjectId,
                    ref: 'ItemInstance'
                },
                legs: {
                    type: Schema.Types.ObjectId,
                    ref: 'ItemInstance'
                },
                neck: {
                    type: Schema.Types.ObjectId,
                    ref: 'ItemInstance'
                },
                offhand: {
                    type: Schema.Types.ObjectId,
                    ref: 'ItemInstance'
                },
                shield: {
                    type: Schema.Types.ObjectId,
                    ref: 'ItemInstance'
                },
                shoulders: {
                    type: Schema.Types.ObjectId,
                    ref: 'ItemInstance'
                },
                waist: {
                    type: Schema.Types.ObjectId,
                    ref: 'ItemInstance'
                },
                wrist1: {
                    type: Schema.Types.ObjectId,
                    ref: 'ItemInstance'
                },
                wrist2: {
                    type: Schema.Types.ObjectId,
                    ref: 'ItemInstance'
                },
                weapon: {
                    type: Schema.Types.ObjectId,
                    ref: 'ItemInstance'
                }            
            },
            affixes: [
                {
                    affix: String,
                    value: Number,
                    secondsRemaining: Number
                }
            ]
        }
    ]
});

const Author = model('Author', authorSchema);
export default Author;