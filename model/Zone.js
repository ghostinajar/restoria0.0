import { ProfilingLevel } from 'mongodb';
import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const zoneSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Author'
    },
    name: String,
    creationDate: {
        type: Date,
        default: Date.now
    },
    modifiedDate: {
        type: Date,
        default: Date.now
    },
    completionStatus: String,
    description: {
        look: String,
        examine: String,
        study: String,
        research: String
    },
    rooms: [
        {
            roomId: String,
            author: {
                type: Schema.Types.ObjectId,
                ref: 'Author'
            },
            roomType: String,
            name: String,
            creationDate: {
                type: Date,
                default: Date.now
            },
            modifiedDate: {
                type: Date,
                default: Date.now
            },
            completionStatus: String,
            playerCap: Number,
            mobCap: Number,
            isDark: Boolean,
            isIndoors: Boolean,
            isOnWater: Boolean,
            isUnderwater: Boolean,
            isOnFire: Boolean,
            blocksMounts: Boolean,
            blocksMobs: Boolean,
            blocksCasting: Boolean,
            blocksCombat: Boolean,
            itemIdsForSale: [String],
            mountIdsForSale: [String],
            mapCoords: {
                x: Number,
                y: Number,
                z: Number
            },
            description: {
                look: String,
                examine: String
            },
            suggestions: [
                {
                    suggestionId: String,
                    author: {
                        type: Schema.Types.ObjectId,
                        ref: 'Author'
                    },
                    body: String,
                    creationDate: {
                        type: Date,
                        default: Date.now
                    },
                    completionDate: {
                        type: Date,
                        default: Date.now
                    }
                }
            ],
            exits: {
                north: {
                    destinationRoomId: String,
                    isHidden: Boolean,
                    isClosed: Boolean,
                    isLocked: Boolean,
                    keyItemId: String,
                    echoes: {
                        unlock: {
                            origin: String,
                            destination: String,
                            user: String,
                        },
                        open: {
                            origin: String,
                            destination: String,
                            user: String,
                        },
                        close: {
                            origin: String,
                            destination: String,
                            user: String,
                        },
                    },
                },
                south: {
                    destinationRoomId: String,
                    isHidden: Boolean,
                    isClosed: Boolean,
                    isLocked: Boolean,
                    keyItemId: String,
                    echoes: {
                        unlock: {
                            origin: String,
                            destination: String,
                            user: String,
                        },
                        open: {
                            origin: String,
                            destination: String,
                            user: String,
                        },
                        close: {
                            origin: String,
                            destination: String,
                            user: String,
                        },
                    },
                },
                east: {
                    destinationRoomId: String,
                    isHidden: Boolean,
                    isClosed: Boolean,
                    isLocked: Boolean,
                    keyItemId: String,
                    echoes: {
                        unlock: {
                            origin: String,
                            destination: String,
                            user: String,
                        },
                        open: {
                            origin: String,
                            destination: String,
                            user: String,
                        },
                        close: {
                            origin: String,
                            destination: String,
                            user: String,
                        },
                    },
                },
                west: {
                    destinationRoomId: String,
                    isHidden: Boolean,
                    isClosed: Boolean,
                    isLocked: Boolean,
                    keyItemId: String,
                    echoes: {
                        unlock: {
                            origin: String,
                            destination: String,
                            user: String,
                        },
                        open: {
                            origin: String,
                            destination: String,
                            user: String,
                        },
                        close: {
                            origin: String,
                            destination: String,
                            user: String,
                        },
                    },
                },
                up: {
                    destinationRoomId: String,
                    isHidden: Boolean,
                    isClosed: Boolean,
                    isLocked: Boolean,
                    keyItemId: String,
                    echoes: {
                        unlock: {
                            origin: String,
                            destination: String,
                            user: String,
                        },
                        open: {
                            origin: String,
                            destination: String,
                            user: String,
                        },
                        close: {
                            origin: String,
                            destination: String,
                            user: String,
                        },
                    },
                },
                down: {
                    destinationRoomId: String,
                    isHidden: Boolean,
                    isClosed: Boolean,
                    isLocked: Boolean,
                    keyItemId: String,
                    echoes: {
                        unlock: {
                            origin: String,
                            destination: String,
                            user: String,
                        },
                        open: {
                            origin: String,
                            destination: String,
                            user: String,
                        },
                        close: {
                            origin: String,
                            destination: String,
                            user: String,
                        },
                    },
                }
            },
            mobNodes: [
                {
                    mobId: String,
                    quanity: Number
                }
            ],
            itemNodes: [
                {
                    itemId: String,
                    quanity: Number
                }
            ]
        },
    ],
    mobs: [
        {
            mobId: String,
            author: {
                type: Schema.Types.ObjectId,
                ref: 'Author'
            },
            name: String,
            pronouns: Number, // 0 = he/him, 1 = she/her, 2 = they/them, 3 = it/it
            creationDate: {
                type: Date,
                default: Date.now
            },
            modifiedDate: {
                type: Date,
                default: Date.now
            },
            completionStatus: String,
            level: Number,
            job: String,
            strength: Number,
            dexterity: Number,
            constitution: Number,
            intelligence: Number,
            wisdom: Number,
            charisma: Number,
            spirit: Number,
            goldHeld: Number,
            isUnique: Boolean,
            isMount: Boolean,
            isAggressive: Boolean,
            chattersPlayer: Boolean,
            emotesPlayer: Boolean,
            description: {
                look: String,
                examine: String,
                study: String,
                research: String
            },
            suggestions: [
                {
                    suggestionId: String,
                    author: {
                        type: Schema.Types.ObjectId,
                        ref: 'Author'
                    },
                    body: String,
                    creationDate: {
                        type: Date,
                        default: Date.now
                    },
                    completionDate: {
                        type: Date,
                        default: Date.now
                    }
                }
            ],
            keywords: [String],
            affixNodes: [
                {
                    affix: String,
                    value: Number
                }
            ],
            chatters: [
                {
                    name: String,
                    text: String,
                }
            ], 
            emotes: [
                {
                    name: String,
                    text: String,
                }
            ],
            itemNodes: [
                {
                    itemId: String,
                    quanity: Number
                }
            ]
        }
    ],
    items: [
        {
            itemId: String,
            author: {
                type: Schema.Types.ObjectId,
                ref: 'Author'
            },
            name: String,
            itemType: String,
            price: Number,
            capacity: Number,
            levelRestriction: Number,
            creationDate: {
                type: Date,
                default: Date.now
            },
            modifiedDate: {
                type: Date,
                default: Date.now
            },
            expiryDate: {
                type: Date,
                default: function() {
                    return Date.now() + 1000 * 60 * 60 * 24 * 180;
                },
            },
            completionStatus: String,
            description: {
                look: String,
                examine: String,
                study: String,
                research: String
            },
            suggestions: [
                {
                    suggestionId: String,
                    author: {
                        type: Schema.Types.ObjectId,
                        ref: 'Author'
                    },
                    body: String,
                    creationDate: {
                        type: Date,
                        default: Date.now
                    },
                    completionDate: {
                        type: Date,
                        default: Date.now
                    }
                }
            ],
            weaponStats: {
                damageDieType: Number,
                damageDieQuantity: Number,
                damageType: String,
                isRanged: Boolean
            },
            spellCharges: {
                name: String,
                level: Number,
                maxCharges: Number
            },
            itemTags: [String],
            keywords: [String],
            wearableLocations: [String],
            affixNodes: [
                {
                    affix: String,
                    value: Number
                }
            ],
            itemNodes: [
                {
                    itemId: String,
                    quanity: Number
                }
            ]
        }
    ]
});

const Zone = model('Zone', zoneSchema);
export default Zone;