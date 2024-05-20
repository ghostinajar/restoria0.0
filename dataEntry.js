/*CAUTION: Used in dev only to populate the database with sample data
Clear after running once. */

import StoredAbuseReport from "./model/data_access/StoredAbuseReport.js";
import StoredCharacter from "./model/data_access/StoredCharacter.js";
import StoredItemInstance from "./model/data_access/StoredItemInstance.js";
import StoredUser from "./model/data_access/StoredUser.js";
import StoredZone from "./model/data_access/StoredZone.js";
import ROOM_TYPE from "./constants/ROOM_TYPE.js";
import COMPLETION_STATUS from "./constants/COMPLETION_STATUS.js";
import JOB from "./constants/JOB.js";
import ITEM_TYPE from "./constants/ITEM_TYPE.js";
import ITEM_TAG from "./constants/ITEM_TAG.js";
import WEARABLE_LOCATION from "./constants/WEARABLE_LOCATION.js";
import AFFIX_TYPE from "./constants/AFFIX_TYPE.js";

const sampleZone = new StoredZone({
    author: '664abf7e3483742125002171',
    name: 'Restoria Town',
    creationDate: '2024-05-20T18:29:59.435Z',
    modifiedDate: '2024-05-20T18:29:59.435Z',
    completionStatus: COMPLETION_STATUS.DRAFT,
    description: {
        look: 'A humble town with a few buildings and a fountain bustles quietly',
        examine: 'Strings of lights hang from the buildings, and the fountain is surrounded by flowers. The townspeople are few, but friendly and welcoming.',
        study: 'Restoria Town is a place of rest and relaxation, where weary travelers can find respite and a warm meal. The town is small and looks to be in the early stages of development. Curiously, and faint magical aura surrounds the town like a dome, and seems to repel harsh weather.',
        research: 'Restoria Town looks old, but the buildings are deceptively new. Watching the villagers or even the animals of the town, you can start to discern a feeling of confusion among them. Some look like they are performing their daily habits for the first time. The only thing in the town whose age stands up to any scrutiny is the central fountain, which appears to be ancient. Rumor has it that the fountain contains secret access to an underground portion of the city.'
    },
    rooms: [
        {
            roomId: 1,
            author: '664abf7e3483742125002171',
            type: ROOM_TYPE.FOUNTAIN,
            name: 'Restoria Town Fountain',
            creationDate: '2024-05-20T18:29:59.435Z',
            modifiedDate: '2024-05-20T18:29:59.435Z',
            completionStatus: COMPLETION_STATUS.DRAFT,
            playerCap: undefined,
            mobCap: 3,
            isDark: false,
            isIndoors: false,
            isOnWater: false,
            isUnderwater: false,
            isOnFire: false,
            blocksMounts: false,
            blocksMobs: false,
            blocksCasting: false,
            blocksCombat: true,
            itemsForSale: undefined, // just Ids
            mountsForSale: undefined, // just Ids
            mapCoords: {
                x: 39,
                y: 39,
                z: 0
            },
            description: {
                look: 'An ancient stone fountain stands in the center of Restoria Town, covered in lichen and moss, and pouring forth clear water into a crystal basin.',
                examine: 'The fountain is carved with intricate designs of animals and plants, designed by masons long forgotten in a style that exists nowhere else in the realm. The water is cool and refreshing, and the sound of it splashing into the basin is soothing. This fountain is at the centre of the town, and some say it also marks the centre of the continent.',
            },
            suggestions: [
                {
                    id: 1,
                    author: '664b9bfb638a7c51d2d1d270',
                    body: 'Can you put coins in the fountain?',
                    creationDate: '2024-05-20T18:29:59.435Z',
                    completionDate: undefined,
                }
            ],
            exits: {
                north: {
                    destinationRoomId: 2,
                    isHidden: false,
                    isClosed: false,
                    isLocked: false,
                    keyItemId: undefined,
                    echoes: {
                        unlock: {
                            origin: undefined,
                            destination: undefined,
                            user: undefined,
                        },
                        open: {
                            origin: undefined,
                            destination: undefined,
                            user: undefined,
                        },
                        close: {
                            origin: undefined,
                            destination: undefined,
                            user: undefined,
                        },
                    },
                },
                south: {
                    destinationRoomId: 4,
                    isHidden: false,
                    isClosed: false,
                    isLocked: false,
                    keyItemId: undefined,
                    echoes: {
                        unlock: {
                            origin: undefined,
                            destination: undefined,
                            user: undefined,
                        },
                        open: {
                            origin: undefined,
                            destination: undefined,
                            user: undefined,
                        },
                        close: {
                            origin: undefined,
                            destination: undefined,
                            user: undefined,
                        },
                    },
                },
                east: {
                    destinationRoomId: 3,
                    isHidden: false,
                    isClosed: false,
                    isLocked: false,
                    keyItemId: undefined,
                    echoes: {
                        unlock: {
                            origin: undefined,
                            destination: undefined,
                            user: undefined,
                        },
                        open: {
                            origin: undefined,
                            destination: undefined,
                            user: undefined,
                        },
                        close: {
                            origin: undefined,
                            destination: undefined,
                            user: undefined,
                        },
                    },
                },
                west: {
                    destinationRoomId: 5,
                    isHidden: false,
                    isClosed: false,
                    isLocked: false,
                    keyItemId: undefined,
                    echoes: {
                        unlock: {
                            origin: undefined,
                            destination: undefined,
                            user: undefined,
                        },
                        open: {
                            origin: undefined,
                            destination: undefined,
                            user: undefined,
                        },
                        close: {
                            origin: undefined,
                            destination: undefined,
                            user: undefined,
                        },
                    },
                },
                up: {
                    destinationRoomId: 6,
                    isHidden: false,
                    isClosed: false,
                    isLocked: false,
                    keyItemId: undefined,
                    echoes: {
                        unlock: {
                            origin: undefined,
                            destination: undefined,
                            user: undefined,
                        },
                        open: {
                            origin: undefined,
                            destination: undefined,
                            user: undefined,
                        },
                        close: {
                            origin: undefined,
                            destination: undefined,
                            user: undefined,
                        },
                    },
                },
                down: {
                    destinationRoomId: 7,
                    isHidden: false,
                    isClosed: false,
                    isLocked: false,
                    keyItemId: undefined,
                    echoes: {
                        unlock: {
                            origin: undefined,
                            destination: undefined,
                            user: undefined,
                        },
                        open: {
                            origin: undefined,
                            destination: undefined,
                            user: undefined,
                        },
                        close: {
                            origin: undefined,
                            destination: undefined,
                            user: undefined,
                        },
                    },
                },
            },
            mobNodes: [
                {
                    mobId: 1,
                    quantity: 3
                }
            ],
            itemNodes: [
                {
                    itemId: 1,
                    quantity: 1
                }
            ]
        },
        {
            roomId: 2,
            author: '664abf7e3483742125002171',
            type: ROOM_TYPE.NONE,
            name: 'North from Fountain',
            creationDate: '2024-05-20T18:29:59.435Z',
            modifiedDate: '2024-05-20T18:29:59.435Z',
            completionStatus: COMPLETION_STATUS.DRAFT,
            playerCap: undefined,
            mobCap: 3,
            isDark: false,
            isIndoors: false,
            isOnWater: false,
            isUnderwater: false,
            isOnFire: false,
            blocksMounts: false,
            blocksMobs: false,
            blocksCasting: false,
            blocksCombat: false,
            itemsForSale: undefined, // just Ids
            mountsForSale: undefined, // just Ids
            mapCoords: {
                x: 39,
                y: 40,
                z: 0
            },
            description: {
                look: 'The room north from the fountain.',
                examine: '(Describe what you see when you examine the room north from the fountain)',
            },
            suggestions: [
                {
                    id: 1,
                    author: '664b9bfb638a7c51d2d1d270',
                    body: 'Finish this north room!',
                    creationDate: '2024-05-20T18:29:59.435Z',
                    completionDate: undefined,
                }
            ],
            exits: {
                north: undefined,
                south: {
                    destinationRoomId: 1,
                    isHidden: false,
                    isClosed: false,
                    isLocked: false,
                    keyItemId: undefined,
                    echoes: {
                        unlock: {
                            origin: undefined,
                            destination: undefined,
                            user: undefined,
                        },
                        open: {
                            origin: undefined,
                            destination: undefined,
                            user: undefined,
                        },
                        close: {
                            origin: undefined,
                            destination: undefined,
                            user: undefined,
                        },
                    },
                },
                east: undefined,
                west: undefined,
                up: undefined,
                down: undefined,
            },
            mobNodes: [
                {
                    mobId: 2,
                    quantity: 1
                }
            ],
            itemNodes: [
                {
                    itemId: 2,
                    quantity: 1
                }
            ]
        },
        {
            roomId: 3,
            author: '664abf7e3483742125002171',
            type: ROOM_TYPE.NONE,
            name: 'East from Fountain',
            creationDate: '2024-05-20T18:29:59.435Z',
            modifiedDate: '2024-05-20T18:29:59.435Z',
            completionStatus: COMPLETION_STATUS.DRAFT,
            playerCap: undefined,
            mobCap: 3,
            isDark: false,
            isIndoors: false,
            isOnWater: false,
            isUnderwater: false,
            isOnFire: false,
            blocksMounts: false,
            blocksMobs: false,
            blocksCasting: false,
            blocksCombat: false,
            itemsForSale: undefined, // just Ids
            mountsForSale: undefined, // just Ids
            mapCoords: {
                x: 40,
                y: 39,
                z: 0
            },
            description: {
                look: 'The room east from the fountain.',
                examine: '(Describe what you see when you examine the room east from the fountain)',
            },
            suggestions: [
                {
                    id: 1,
                    author: '664b9bfb638a7c51d2d1d270',
                    body: 'Finish this east room!',
                    creationDate: '2024-05-20T18:29:59.435Z',
                    completionDate: undefined,
                }
            ],
            exits: {
                north: undefined,
                south: undefined,
                east: undefined,
                west: {
                    destinationRoomId: 1,
                    isHidden: false,
                    isClosed: false,
                    isLocked: false,
                    keyItemId: undefined,
                    echoes: {
                        unlock: {
                            origin: undefined,
                            destination: undefined,
                            user: undefined,
                        },
                        open: {
                            origin: undefined,
                            destination: undefined,
                            user: undefined,
                        },
                        close: {
                            origin: undefined,
                            destination: undefined,
                            user: undefined,
                        },
                    },
                },
                up: undefined,
                down: undefined,
            },
            mobNodes: [
                {
                    mobId: 2,
                    quantity: 1
                }
            ],
            itemNodes: [
                {
                    itemId: 2,
                    quantity: 1
                }
            ]
        },
        {
            roomId: 4,
            author: '664abf7e3483742125002171',
            type: ROOM_TYPE.NONE,
            name: 'South from Fountain',
            creationDate: '2024-05-20T18:29:59.435Z',
            modifiedDate: '2024-05-20T18:29:59.435Z',
            completionStatus: COMPLETION_STATUS.DRAFT,
            playerCap: undefined,
            mobCap: 3,
            isDark: false,
            isIndoors: false,
            isOnWater: false,
            isUnderwater: false,
            isOnFire: false,
            blocksMounts: false,
            blocksMobs: false,
            blocksCasting: false,
            blocksCombat: false,
            itemsForSale: undefined, // just Ids
            mountsForSale: undefined, // just Ids
            mapCoords: {
                x: 39,
                y: 38,
                z: 0
            },
            description: {
                look: 'The room south from the fountain.',
                examine: '(Describe what you see when you examine the room south from the fountain)',
            },
            suggestions: [
                {
                    id: 1,
                    author: '664b9bfb638a7c51d2d1d270',
                    body: 'Finish this south room!',
                    creationDate: '2024-05-20T18:29:59.435Z',
                    completionDate: undefined,
                }
            ],
            exits: {
                north: {
                    destinationRoomId: 1,
                    isHidden: false,
                    isClosed: false,
                    isLocked: false,
                    keyItemId: undefined,
                    echoes: {
                        unlock: {
                            origin: undefined,
                            destination: undefined,
                            user: undefined,
                        },
                        open: {
                            origin: undefined,
                            destination: undefined,
                            user: undefined,
                        },
                        close: {
                            origin: undefined,
                            destination: undefined,
                            user: undefined,
                        },
                    },
                },
                south: undefined,
                east: undefined,
                west: undefined,
                up: undefined,
                down: undefined,
            },
            mobNodes: [
                {
                    mobId: 2,
                    quantity: 1
                }
            ],
            itemNodes: [
                {
                    itemId: 2,
                    quantity: 1
                }
            ]
        },
        {
            roomId: 5,
            author: '664abf7e3483742125002171',
            type: ROOM_TYPE.NONE,
            name: 'West from Fountain',
            creationDate: '2024-05-20T18:29:59.435Z',
            modifiedDate: '2024-05-20T18:29:59.435Z',
            completionStatus: COMPLETION_STATUS.DRAFT,
            playerCap: undefined,
            mobCap: 3,
            isDark: false,
            isIndoors: false,
            isOnWater: false,
            isUnderwater: false,
            isOnFire: false,
            blocksMounts: false,
            blocksMobs: false,
            blocksCasting: false,
            blocksCombat: false,
            itemsForSale: undefined, // just Ids
            mountsForSale: undefined, // just Ids
            mapCoords: {
                x: 38,
                y: 39,
                z: 0
            },
            description: {
                look: 'The room west from the fountain.',
                examine: '(Describe what you see when you examine the room west from the fountain)',
            },
            suggestions: [
                {
                    id: 1,
                    author: '664b9bfb638a7c51d2d1d270',
                    body: 'Finish this west room!',
                    creationDate: '2024-05-20T18:29:59.435Z',
                    completionDate: undefined,
                }
            ],
            exits: {
                north: undefined,
                south: undefined,
                east: {
                    destinationRoomId: 1,
                    isHidden: false,
                    isClosed: false,
                    isLocked: false,
                    keyItemId: undefined,
                    echoes: {
                        unlock: {
                            origin: undefined,
                            destination: undefined,
                            user: undefined,
                        },
                        open: {
                            origin: undefined,
                            destination: undefined,
                            user: undefined,
                        },
                        close: {
                            origin: undefined,
                            destination: undefined,
                            user: undefined,
                        },
                    },
                },
                west: undefined,
                up: undefined,
                down: undefined,
            },
            mobNodes: [
                {
                    mobId: 2,
                    quantity: 1
                }
            ],
            itemNodes: [
                {
                    itemId: 2,
                    quantity: 1
                }
            ]
        },
        {
            roomId: 6,
            author: '664abf7e3483742125002171',
            type: ROOM_TYPE.NONE,
            name: 'Up from Fountain',
            creationDate: '2024-05-20T18:29:59.435Z',
            modifiedDate: '2024-05-20T18:29:59.435Z',
            completionStatus: COMPLETION_STATUS.DRAFT,
            playerCap: undefined,
            mobCap: 3,
            isDark: false,
            isIndoors: true,
            isOnWater: false,
            isUnderwater: false,
            isOnFire: false,
            blocksMounts: true,
            blocksMobs: false,
            blocksCasting: false,
            blocksCombat: false,
            itemsForSale: undefined, // just Ids
            mountsForSale: undefined, // just Ids
            mapCoords: {
                x: 38,
                y: 38,
                z: 1
            },
            description: {
                look: 'The room up from the fountain.',
                examine: '(Describe what you see when you examine the room up from the fountain)',
            },
            suggestions: [
                {
                    id: 1,
                    author: '664b9bfb638a7c51d2d1d270',
                    body: 'Finish this up room!',
                    creationDate: '2024-05-20T18:29:59.435Z',
                    completionDate: undefined,
                }
            ],
            exits: {
                north: undefined,
                south: undefined,
                east: undefined,
                west: undefined,
                up: undefined,
                down: {
                    destinationRoomId: 1,
                    isHidden: false,
                    isClosed: false,
                    isLocked: false,
                    keyItemId: undefined,
                    echoes: {
                        unlock: {
                            origin: undefined,
                            destination: undefined,
                            user: undefined,
                        },
                        open: {
                            origin: undefined,
                            destination: undefined,
                            user: undefined,
                        },
                        close: {
                            origin: undefined,
                            destination: undefined,
                            user: undefined,
                        },
                    },
                },
            },
            mobNodes: [
                {
                    mobId: 2,
                    quantity: 1
                }
            ],
            itemNodes: [
                {
                    itemId: 2,
                    quantity: 1
                }
            ]
        },
        {
            roomId: 7,
            author: '664abf7e3483742125002171',
            type: ROOM_TYPE.NONE,
            name: 'Down from Fountain',
            creationDate: '2024-05-20T18:29:59.435Z',
            modifiedDate: '2024-05-20T18:29:59.435Z',
            completionStatus: COMPLETION_STATUS.DRAFT,
            playerCap: undefined,
            mobCap: 3,
            isDark: true,
            isIndoors: true,
            isOnWater: false,
            isUnderwater: true,
            isOnFire: false,
            blocksMounts: true,
            blocksMobs: false,
            blocksCasting: false,
            blocksCombat: false,
            itemsForSale: undefined, // just Ids
            mountsForSale: undefined, // just Ids
            mapCoords: {
                x: 38,
                y: 38,
                z: -1
            },
            description: {
                look: 'The room down from the fountain.',
                examine: '(Describe what you see when you examine the room down from the fountain)',
            },
            suggestions: [
                {
                    id: 1,
                    author: '664b9bfb638a7c51d2d1d270',
                    body: 'Finish this down room!',
                    creationDate: '2024-05-20T18:29:59.435Z',
                    completionDate: undefined,
                }
            ],
            exits: {
                north: undefined,
                south: undefined,
                east: undefined,
                west: undefined,
                up: {
                    destinationRoomId: 1,
                    isHidden: false,
                    isClosed: false,
                    isLocked: false,
                    keyItemId: undefined,
                    echoes: {
                        unlock: {
                            origin: undefined,
                            destination: undefined,
                            user: undefined,
                        },
                        open: {
                            origin: undefined,
                            destination: undefined,
                            user: undefined,
                        },
                        close: {
                            origin: undefined,
                            destination: undefined,
                            user: undefined,
                        },
                    },
                },
                down: undefined,
            },
            mobNodes: [
                {
                    mobId: 2,
                    quantity: 1
                }
            ],
            itemNodes: [
                {
                    itemId: 2,
                    quantity: 1
                }
            ]
        },
    ],
    mobs: [
        {
            mobId: 1,
            author: '664abf7e3483742125002171',
            name: 'a mango lovebird',
            pronouns: 0, // 0 = it/it, 1 = he/him, 2 = she/her, 3 = they/them
            creationDate: '2024-05-20T18:29:59.435Z',
            modifiedDate: '2024-05-20T18:29:59.435Z',
            completionStatus: COMPLETION_STATUS.DRAFT,
            level: 1,
            job: JOB.THIEF,
            strength: 8,
            dexterity: 12,
            constitution: 10,
            intelligence: 10,
            wisdom: 10,
            charisma: 14,
            spirit: 10,
            goldHeld: 5,
            isUnique: false,
            isMount: false,
            isAggressive: false,
            chattersPlayer: false,
            emotesPlayer: true,
            description: {
                look: 'This bird has the size, colour, and sweetness of small, ripe mango.',
                examine: "Its feathers are so small and delicate that you'd have to look closely to see them. The bird is a bright orange, with a yellow belly and a green tail. Its eyes are large and black, and it has a round beak. It hops around the fountain, chirping and looking for its companion.",
                study: undefined,
                research: undefined
            },
            suggestions: [
                {
                    suggestionId: 1,
                    author: '664b9bfb638a7c51d2d1d270',
                    body: "Cute! Can't wait to see the study and research descriptions! Could it be carrying something?",
                    creationDate: '2024-05-20T18:29:59.435Z',
                    completionDate: undefined,
                }
            ],
            keywords: [bird, lovebird, mango],
            affixNodes: [],
            chatters: [], 
            emotes: [
                {
                    name: 'hop',
                    text: 'hops merrily around the fountain.',
                }
            ],
            itemNodes: []
        },
        {
            mobId: 2,
            author: '664abf7e3483742125002171',
            name: 'a goblin',
            pronouns: 0, // 0 = it/it, 1 = he/him, 2 = she/her, 3 = they/them
            creationDate: '2024-05-20T18:29:59.435Z',
            modifiedDate: '2024-05-20T18:29:59.435Z',
            completionStatus: COMPLETION_STATUS.DRAFT,
            level: 1,
            job: JOB.WARRIOR,
            strength: 12,
            dexterity: 10,
            constitution: 12,
            intelligence: 8,
            wisdom: 8,
            charisma: 8,
            spirit: 12,
            goldHeld: 20,
            isUnique: false,
            isMount: false,
            isAggressive: false,
            chattersPlayer: true,
            emotesPlayer: true,
            description: {
                look: "A standard, greenish brown goblin mills about.",
                examine: "The goblin is small and wiry, with a sharp-toothed grin and beady eyes. It's wearing a tattered loincloth and carrying a little dagger. It looks like it's up to no good.",
                study: undefined,
                research: undefined
            },
            suggestions: [
                {
                    suggestionId: 1,
                    author: '664b9bfb638a7c51d2d1d270',
                    body: "Nice goblin. Can't wait to see the study and research descriptions! More items please.",
                    creationDate: '2024-05-20T18:29:59.435Z',
                    completionDate: undefined,
                }
            ],
            keywords: [goblin, brown, greenish],
            affixNodes: [],
            chatters: [
                {
                    name: 'hello',
                    text: 'Hello.',
                }
            ], 
            emotes: [
                {
                    name: 'hop',
                    text: 'hops merrily around the fountain.',
                }
            ],
            itemNodes: []
        }
    ],
    items: [
        {
            itemId: 1,
            author: '664abf7e3483742125002171',
            name: 'a strange, golden coin',
            itemType: ITEM_TYPE.NONE,
            price: 100,
            capacity: undefined,
            levelRestriction: undefined,
            creationDate: '2024-05-20T18:29:59.435Z',
            modifiedDate: '2024-05-20T18:29:59.435Z',
            tweakDuration: undefined,
            completionStatus: COMPLETION_STATUS.DRAFT,
            description: {
                look: 'This is strange, golden coin stamped with symbols you do not recognize.',
                examine: 'The coin is made of a golden-hued metal you cannot identify. On its surface is stamped a spiral of characters in an ancient script. The coin is warm to the touch, and you feel a sense of yearning when you hold it.',
                study: undefined,
                research: undefined
            },
            suggestions: [
                {
                    suggestionId: 1,
                    author: '664b9bfb638a7c51d2d1d270',
                    body: 'cool coin! We should attach a spell to it or something.',
                    creationDate: '2024-05-20T18:29:59.435Z',
                    completionDate: undefined,
                }
            ],
            weaponStats: undefined,
            spellCharges: undefined,
            tags: [ITEM_TAG.TEMPORARY],
            keywords: [strange, gold, golden, coin],
            wearableLocations: [WEARABLE_LOCATION.HELD],
            affixNodes: [
                {
                    affixType: AFFIX_TYPE.WISDOM,
                    value: 1
                }
            ], 
            itemNodes: []
        },
        {
            itemId: 2,
            author: '664abf7e3483742125002171',
            name: 'an apple',
            itemType: ITEM_TYPE.FOOD,
            price: 10,
            capacity: undefined,
            levelRestriction: undefined,
            creationDate: '2024-05-20T18:29:59.435Z',
            modifiedDate: '2024-05-20T18:29:59.435Z',
            tweakDuration: undefined,
            completionStatus: COMPLETION_STATUS.DRAFT,
            description: {
                look: 'A red apple is here, looking crisp and juicy.',
                examine: 'The apple is a deep red, with a shiny skin and a green leaf on top. It smells sweet and fresh.',
                study: undefined,
                research: undefined
            },
            suggestions: [
                {
                    suggestionId: 1,
                    author: '664b9bfb638a7c51d2d1d270',
                    body: "yum. I don't think we need study/research descriptions on this one (who studies an apple?) but maybe we could make it a quest item or something.",
                    creationDate: '2024-05-20T18:29:59.435Z',
                    completionDate: undefined,
                }
            ],
            weaponStats: undefined,
            spellCharges: undefined,
            tags: [],
            keywords: [red, crisp, juicy, apple],
            wearableLocations: [],
            affixNodes: [], 
            itemNodes: []
        }
    ]
});
//TODO load this once and run the app, then comment it out

export default sampleZone;