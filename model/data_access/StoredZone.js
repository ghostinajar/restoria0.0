import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const storedZoneSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'StoredUser'
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
            roomId: Number,
            author: {
                type: Schema.Types.ObjectId,
                ref: 'StoredUser'
            },
            type: String,
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
            itemsForSale: [String], // just Ids
            mountsForSale: [String], // just Ids
            //mapCoord at "centre" of zone is 39,39,0 (so map can be loaded from 0,0 out to 79,79)
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
                    suggestionId: Number,
                    author: {
                        type: Schema.Types.ObjectId,
                        ref: 'StoredUser'
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
                    destinationRoomId: Number,
                    isHidden: Boolean,
                    isClosed: Boolean,
                    isLocked: Boolean,
                    keyItemId: Number,
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
                    destinationRoomId: Number,
                    isHidden: Boolean,
                    isClosed: Boolean,
                    isLocked: Boolean,
                    keyItemId: Number,
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
                    destinationRoomId: Number,
                    isHidden: Boolean,
                    isClosed: Boolean,
                    isLocked: Boolean,
                    keyItemId: Number,
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
                    destinationRoomId: Number,
                    isHidden: Boolean,
                    isClosed: Boolean,
                    isLocked: Boolean,
                    keyItemId: Number,
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
                    destinationRoomId: Number,
                    isHidden: Boolean,
                    isClosed: Boolean,
                    isLocked: Boolean,
                    keyItemId: Number,
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
                    destinationRoomId: Number,
                    isHidden: Boolean,
                    isClosed: Boolean,
                    isLocked: Boolean,
                    keyItemId: Number,
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
                    mobId: Number,
                    quantity: Number
                }
            ],
            itemNodes: [
                {
                    itemId: Number,
                    quantity: Number
                }
            ]
        },
    ],
    mobs: [
        {
            mobId: Number,
            author: {
                type: Schema.Types.ObjectId,
                ref: 'StoredUser'
            },
            name: String,
            pronouns: Number, // 0 = it/it, 1 = he/him, 2 = she/her, 3 = they/them
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
                    suggestionId: Number,
                    author: {
                        type: Schema.Types.ObjectId,
                        ref: 'StoredUser'
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
                    affixType: String,
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
                    itemId: Number,
                    quantity: Number
                }
            ]
        }
    ],
    items: [
        {
            itemId: Number,
            author: {
                type: Schema.Types.ObjectId,
                ref: 'StoredUser'
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
            tweakDuration: {
                type: Number,
                default: 182,
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
                    suggestionId: Number,
                    author: {
                        type: Schema.Types.ObjectId,
                        ref: 'StoredUser'
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
            tags: [String],
            keywords: [String],
            wearableLocations: [String],
            affixNodes: [
                {
                    affixType: String,
                    value: Number
                }
            ],
            itemNodes: [
                {
                    itemId: Number,
                    quantity: Number
                }
            ]
        }
    ]
});

const StoredZone = model('StoredZone', zoneSchema);
export default StoredZone;
