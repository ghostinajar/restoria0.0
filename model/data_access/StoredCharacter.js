import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const storedCharacterSchema = new Schema({   
    name: String,
    pronouns: Number, // 0 = he/him, 1 = she/her, 2 = they/them, 3 = it/it
    location: {
        zoneId: {
            type: Schema.Types.ObjectId,
            ref: 'StoredZone'
        },
        roomId: String
    },
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
            ref: 'StoredItemInstance'
        }
    ],
    equipped: {
        arms: {
            type: Schema.Types.ObjectId,
            ref: 'StoredItemInstance'
        },
        body: {
            type: Schema.Types.ObjectId,
            ref: 'StoredItemInstance'
        },
        ears: {
            type: Schema.Types.ObjectId,
            ref: 'StoredItemInstance'
        },
        feet: {
            type: Schema.Types.ObjectId,
            ref: 'StoredItemInstance'
        },
        finger1: {
            type: Schema.Types.ObjectId,
            ref: 'StoredItemInstance'
        },
        finger2: {
            type: Schema.Types.ObjectId,
            ref: 'StoredItemInstance'
        },
        hands: {
            type: Schema.Types.ObjectId,
            ref: 'StoredItemInstance'
        },
        head: {
            type: Schema.Types.ObjectId,
            ref: 'StoredItemInstance'
        },
        legs: {
            type: Schema.Types.ObjectId,
            ref: 'StoredItemInstance'
        },
        neck: {
            type: Schema.Types.ObjectId,
            ref: 'StoredItemInstance'
        },
        offhand: {
            type: Schema.Types.ObjectId,
            ref: 'StoredItemInstance'
        },
        shield: {
            type: Schema.Types.ObjectId,
            ref: 'StoredItemInstance'
        },
        shoulders: {
            type: Schema.Types.ObjectId,
            ref: 'StoredItemInstance'
        },
        waist: {
            type: Schema.Types.ObjectId,
            ref: 'StoredItemInstance'
        },
        wrist1: {
            type: Schema.Types.ObjectId,
            ref: 'StoredItemInstance'
        },
        wrist2: {
            type: Schema.Types.ObjectId,
            ref: 'StoredItemInstance'
        },
        weapon: {
            type: Schema.Types.ObjectId,
            ref: 'StoredItemInstance'
        }            
    },
    affixes: [
        {
            affix: String,
            value: Number,
            secondsRemaining: Number
        }
    ],
});

const StoredCharacter = model('StoredCharacter', storedCharacterSchema);
export default StoredCharacter;
