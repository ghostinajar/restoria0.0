import AFFIX_TYPE from "./constants/AFFIX_TYPE.js";
import DAMAGE_TYPE from "./constants/DAMAGE_TYPE.js";
import COMPLETION_STATUS from "./constants/COMPLETION_STATUS.js";
import ITEM_TAG from "./constants/ITEM_TAG.js";
import ITEM_TYPE from "./constants/ITEM_TYPE.js";
import JOB from "./constants/JOB.js";
import ROOM_TYPE from "./constants/ROOM_TYPE.js";
import WEARABLE_LOCATION from "./constants/WEARABLE_LOCATION.js";

// export const rayu = {
//     name: 'Rayu',
//     pronouns: 1,
//     location: {
//         inZone: '664f8ca70cc5ae9b173969a8',
//         inRoom: '',
//         },
//     job: 'mage',
//     statBlock: {
//         strength: 12,
//         dexterity: 12,
//         constitution: 12,
//         intelligence: 14,
//         wisdom: 12,
//         charisma: 12,
//         spirit: 0,
//     },
//     goldHeld: Number,
//     goldBanked: Number,
//     trainingPoints: Number,
//     jobLevels: {
//         cleric: Number,
//         mage: Number,
//         thief: Number,
//         warrior: Number
//     },
//     description: {
//         type: descriptionSchema,
//         default: () => ({})
//     },
//     //TODO decide how to implement training. should name be one from a list of SPELLS constants?
//     //should I merge command authorization with character ability authorization, where most commands
//     //like create room have a default level 1, but trainable abilities like bash or cast fireball
//     //can have higher levels which help calculate their effects?
//     trained: {
//         passives: [{
//             name: String,
//             level: Number
//         }],
//         spells: [{
//             name: String,
//             level: Number
//         }],
//     },
//     inventory: {
//         type: Map,
//         of: {
//           type: Schema.Types.ObjectId,
//           ref: 'ItemInstance'
//         }
//     },
//     equipped: {
//         arms: {
//             type: Schema.Types.ObjectId,
//             ref: 'ItemInstance'
//         },
//         body: {
//             type: Schema.Types.ObjectId,
//             ref: 'ItemInstance'
//         },
//         ears: {
//             type: Schema.Types.ObjectId,
//             ref: 'ItemInstance'
//         },
//         feet: {
//             type: Schema.Types.ObjectId,
//             ref: 'ItemInstance'
//         },
//         finger1: {
//             type: Schema.Types.ObjectId,
//             ref: 'ItemInstance'
//         },
//         finger2: {
//             type: Schema.Types.ObjectId,
//             ref: 'ItemInstance'
//         },
//         hands: {
//             type: Schema.Types.ObjectId,
//             ref: 'ItemInstance'
//         },
//         head: {
//             type: Schema.Types.ObjectId,
//             ref: 'ItemInstance'
//         },
//         held: {
//             type: Schema.Types.ObjectId,
//             ref: 'ItemInstance'
//         },
//         legs: {
//             type: Schema.Types.ObjectId,
//             ref: 'ItemInstance'
//         },
//         neck: {
//             type: Schema.Types.ObjectId,
//             ref: 'ItemInstance'
//         },
//         shield: {
//             type: Schema.Types.ObjectId,
//             ref: 'ItemInstance'
//         },
//         shoulders: {
//             type: Schema.Types.ObjectId,
//             ref: 'ItemInstance'
//         },
//         waist: {
//             type: Schema.Types.ObjectId,
//             ref: 'ItemInstance'
//         },
//         wrist1: {
//             type: Schema.Types.ObjectId,
//             ref: 'ItemInstance'
//         },
//         wrist2: {
//             type: Schema.Types.ObjectId,
//             ref: 'ItemInstance'
//         },
//         weapon1: {
//             type: Schema.Types.ObjectId,
//             ref: 'ItemInstance'
//         },
//         weapon2: {
//             type: Schema.Types.ObjectId,
//             ref: 'ItemInstance'
//         },               
//     },
//     affixes: [{
//         type: affixSchema,
//         default: () => ({})
//     }],
// }
