/*CAUTION: Used in dev only to populate the database with sample data
Clear after running once. */

import ROOM_TYPE from "./constants/ROOM_TYPE.js";
import JOB from "./constants/JOB.js";
import ITEM_TYPE from "./constants/ITEM_TYPE.js";
import ITEM_TAG from "./constants/ITEM_TAG.js";
import WEARABLE_LOCATION from "./constants/WEARABLE_LOCATION.js";
import AFFIX_TYPE from "./constants/AFFIX_TYPE.js";
import DAMAGE_TYPE from "./constants/DAMAGE_TYPE.js";

const sampleZone = {
    zoneNumber: 1,
    author: '664abf7e3483742125002171',
    name: 'Restoria Town',
    description: {
        look: 'A humble town with a few buildings and a fountain bustles quietly',
        examine: 'Strings of lights hang from the buildings, and the fountain is surrounded by flowers. The townspeople are few, but friendly and welcoming.',
        study: 'Restoria Town is a place of rest and relaxation, where weary travelers can find respite and a warm meal. The town is small and looks to be in the early stages of development. Curiously, and faint magical aura surrounds the town like a dome, and seems to repel harsh weather.',
        research: 'Restoria Town looks old, but the buildings are deceptively new. Watching the villagers or even the animals of the town, you can start to discern a feeling of confusion among them. Some look like they are performing their daily habits for the first time. The only thing in the town whose age stands up to any scrutiny is the central fountain, which appears to be ancient. Rumor has it that the fountain contains secret access to an underground portion of the city.'
    },
    rooms: [
        {
            roomNumber: 1,
            author: '664abf7e3483742125002171',
            roomType: ROOM_TYPE.FOUNTAIN,
            name: 'Restoria Town Fountain',
            blocksCombat: true,
            mapCoords: {
                x: 39,
                y: 39,
                z: 0
            },
            description: {
                look: 'An ancient stone fountain stands in the center of Restoria Town, covered in lichen and moss, and pouring forth clear water into a crystal basin.',
                examine: 'The fountain is carved with intricate designs of animals and plants, designed by masons long forgotten in a style that exists nowhere else in the realm. The water is cool and refreshing, and the sound of it splashing into the basin is soothing. This fountain is at the centre of the town, and some say it also marks the centre of the continent.',
            },
            exits: {
                north: {
                    destinationRoomNumber: 2,
                },
                south: {
                    destinationRoomNumber: 4,
                },
                east: {
                    destinationRoomNumber: 3,
                },
                west: {
                    destinationRoomNumber: 5,
                },
                up: {
                    destinationRoomNumber: 6,
                },
                down: {
                    destinationRoomNumber: 7,
                },
            },
            mobNodes: [
                {
                mobNumber: 1,
                quantity: 3
                }
            ],            
            itemNodes: [
                {
                itemNumber: 1,
                quantity: 1
                }
            ],
        },
        {
            roomNumber: 2,
            author: '664abf7e3483742125002171',
            name: 'North from Fountain',
            mapCoords: {
                x: 39,
                y: 40,
                z: 0
            },
            description: {
                look: 'The room north from the fountain.',
                examine: '(Describe what you see when you examine the room north from the fountain)',
            },
            exits: {
                south: {
                    destinationRoomNumber: 1,
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
                    quantity: 2
                }
            ],
        },
        {
            roomNumber: 3,
            author: '664abf7e3483742125002171',
            name: 'East from Fountain',
            mapCoords: {
                x: 40,
                y: 39,
                z: 0
            },
            description: {
                look: 'The room east from the fountain.',
                examine: '(Describe what you see when you examine the room east from the fountain)',
            },
            exits: {
                west: {
                    destinationRoomNumber: 1,
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
                    quantity: 2
                }
            ],
        },
        {
            roomNumber: 4,
            author: '664abf7e3483742125002171',
            name: 'South from Fountain',
            mapCoords: {
                x: 39,
                y: 38,
                z: 0
            },
            description: {
                look: 'The room south from the fountain.',
                examine: '(Describe what you see when you examine the room south from the fountain)',
            },
            exits: {
                north: {
                    destinationRoomNumber: 1,
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
                    quantity: 2
                }
            ],
        },
        {
            roomNumber: 5,
            author: '664abf7e3483742125002171',
            name: 'West from Fountain',
            mapCoords: {
                x: 38,
                y: 39,
                z: 0
            },
            description: {
                look: 'The room west from the fountain.',
                examine: '(Describe what you see when you examine the room west from the fountain)',
            },
            exits: {
                east: {
                    destinationRoomNumber: 1,
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
                    quantity: 2
                }
            ],
        },
        {
            roomNumber: 6,
            author: '664abf7e3483742125002171',
            name: 'Up from Fountain',
           mapCoords: {
                x: 39,
                y: 39,
                z: 1
            },
            description: {
                look: 'The room up from the fountain.',
                examine: '(Describe what you see when you examine the room up from the fountain)',
            },
            exits: {
                down: {
                    destinationRoomNumber: 1,
                    isHidden: true,
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
                    itemId: 5,
                    quantity: 1
                }
            ],
        },
        {
            roomNumber: 7,
            author: '664abf7e3483742125002171',
            name: 'Down from Fountain',
            mapCoords: {
                x: 39,
                y: 39,
                z: -1
            },
            description: {
                look: 'The room down from the fountain.',
                examine: '(Describe what you see when you examine the room down from the fountain)',
            },
            exits: {
                up: {
                    destinationRoomNumber: 1,
                },
            },
            mobNodes: [
                {
                    mobId: 2,
                    quantity: 5
                }
            ],            
            itemNodes: [
                {
                    itemId: 4,
                    quantity: 1
                }
            ],
        },
    ],
    mobs: [
        {
            mobNumber: 1,
            author: '664abf7e3483742125002171',
            name: 'a mango lovebird',
            pronouns: 0, // 0 = it/it, 1 = he/him, 2 = she/her, 3 = they/them
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
            emotesToPlayer: true,
            description: {
                look: 'This bird has the size, colour, and sweetness of small, ripe mango.',
                examine: "Its feathers are so small and delicate that you'd have to look closely to see them. The bird is a bright orange, with a yellow belly and a green tail. Its eyes are large and black, and it has a round beak. It hops around the fountain, chirping and looking for its companion.",
            },
            keywords: ['bird', 'lovebird', 'mango'],
            emotes: [
                {
                    name: 'hop',
                    text: 'hops merrily around the fountain.',
                }
            ],
            itemNodes: [
                {
                    itemNumber: 3,
                    quantity: 1
                }
            ],
        },
        {
            mobNumber: 2,
            author: '664abf7e3483742125002171',
            name: 'a goblin',
            pronouns: 0, // 0 = it/it, 1 = he/him, 2 = she/her, 3 = they/them
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
            chattersToPlayer: true,
            description: {
                look: "A standard, greenish brown goblin mills about.",
                examine: "The goblin is small and wiry, with a sharp-toothed grin and beady eyes. It's wearing a tattered loincloth and carrying a little dagger. It looks like it's up to no good.",    
            },
            keywords: ['goblin', 'brown', 'greenish'],
            chatters: [
                {
                    name: 'hello',
                    text: 'Hello.',
                }
            ], 
            itemNodes: [
                {
                    itemNumber: 4,
                    quantity: 1
                }
            ],
        },
    ],
    items: [
        {
            itemNumber: 1,
            author: '664abf7e3483742125002171',
            name: 'a strange, golden coin',
            price: 100,
            description: {
                look: 'This is strange, golden coin stamped with symbols you do not recognize.',
                examine: 'The coin is made of a golden-hued metal you cannot identify. On its surface is stamped a spiral of characters in an ancient script. The coin is warm to the touch, and you feel a sense of yearning when you hold it.',
            },
            tags: [ITEM_TAG.TEMPORARY],
            keywords: ['strange', 'gold', 'golden', 'coin'],
            wearableLocations: [WEARABLE_LOCATION.HELD],
            affixNodes: [
                {
                    affixType: AFFIX_TYPE.WISDOM,
                    value: 1
                }
            ],
        },
        {
            itemNumber: 2,
            author: '664abf7e3483742125002171',
            name: 'an apple',
            itemType: ITEM_TYPE.FOOD,
            price: 10,
            description: {
                look: 'A red apple is here, looking crisp and juicy.',
                examine: 'The apple is a deep red, with a shiny skin and a green leaf on top. It smells sweet and fresh.',
            },
            keywords: ['red', 'crisp', 'juicy', 'apple'],
        },
        {
            itemNumber: 3,
            author: '664abf7e3483742125002171',
            name: 'a pinch of birdseed',
            itemType: ITEM_TYPE.FOOD,
            price: 10,
            description: {
                look: 'Some bright, shiny birdseed is scattered on the ground.',
                examine: "The birdseed is a mix of seeds and nuts, and it smells fresh and tasty. It's a little shinier than you'd expect, almost glowing.",
            },  
            spellCharges: {
                name: 'bless',
                level: 10,
            },
            tags: [ITEM_TAG.LIGHT, ITEM_TAG.TEMPORARY],
            keywords: ['bright', 'shiny', 'birdseed'],
        },
        {
            itemNumber: 4,
            author: '664abf7e3483742125002171',
            name: 'a little dagger',
            itemType: ITEM_TYPE.WEAPON,
            price: 50,
            levelRestriction: 2,
            description: {
                look: 'A little dagger is lying here.',
                examine: 'Smaller than your average dagger, this little dagger is sharp but poorly crafted. The hilt is wrapped in leather, and the blade is made of some dull, cheap metal.',
            },
            weaponStats: {
                damageDieSides: 3,
                damageDieQuantity: 1,
                damageType: DAMAGE_TYPE.PIERCING,
            },
            tags: [ITEM_TAG.DAGGER, ITEM_TAG.OFFHAND, ITEM_TAG.THIEF],
            keywords: ['little', 'dagger'],
            wearableLocations: [WEARABLE_LOCATION.WEAPON1, WEARABLE_LOCATION.WEAPON2],
            affixNodes: [
                {
                    affixType: AFFIX_TYPE.HITBONUS,
                    value: 1,
                },
                {
                    affixType: AFFIX_TYPE.DAMAGEBONUS,
                    value: 1,
                }
            ],
        },
        {
            itemNumber: 5,
            author: '664abf7e3483742125002171',
            name: 'a big wooden bin',
            itemType: ITEM_TYPE.CONTAINER,
            price: 25,
            capacity: 100,    
            description: {
                look: "There's a big wooden bin on the ground here.",
                examine: 'Made of thick, heavy planks and iron bands, this bin is sturdy and weighs more than anyone would be comfortable carrying. It smells faintly of apples.',
            },
            tags: [ITEM_TAG.FIXTURE],
            keywords: ['wooden', 'bin'],
            itemNodes: [
                {
                itemNumber: 2,
                quantity: 1
                }
            ],
        },
    ],
    suggestions: [
        {
            suggestionNumber: 1,
            author: '664b9bfb638a7c51d2d1d270',
            refersToRoomNumber: 1,
            body: 'Can you put coins in the fountain?',
        },
        {
            suggestionNumber: 2,
            author: '664b9bfb638a7c51d2d1d270',
            refersToRoomNumber: 2,
            body: 'Finish this north room!',
        },
        {
            suggestionNumber: 3,
            author: '664b9bfb638a7c51d2d1d270',
            refersToRoomNumber: 3,
            body: 'Finish this east room!',
        },
        {
            suggestionNumber: 4,
            author: '664b9bfb638a7c51d2d1d270',
            refersToRoomNumber: 4,
            body: 'Finish this south room!',
        },
        {
            suggestionNumber: 5,
            author: '664b9bfb638a7c51d2d1d270',
            refersToRoomNumber: 5,
            body: 'Finish this west room!',
        },
        {
            suggestionNumber: 6,
            author: '664b9bfb638a7c51d2d1d270',
            refersToRoomNumber: 6,
            body: 'Finish this up room!',
        },
        {
            suggestionNumber: 7,
            author: '664b9bfb638a7c51d2d1d270',
            refersToRoomNumber: 7,
            body: 'Finish this up room!',
         },
        {
            suggestionNumber: 8,            
            author: '664b9bfb638a7c51d2d1d270',
            refersToMobNumber: 1,
            body: "Cute! Can't wait to see the study and research descriptions! Could it be carrying something?",
        },
        {
            suggestionNumber: 9,            
            author: '664b9bfb638a7c51d2d1d270',
            refersToMobNumber: 2,
            body: "Nice goblin. Can't wait to see the study and research descriptions! More items please.",
        },
        {
            suggestionNumber: 10,            
            author: '664b9bfb638a7c51d2d1d270',
            refersToItemNumber: 1,
            body: 'cool coin! We should attach a spell to it or something.',
        },
        {
            suggestionNumber: 11,            
            author: '664b9bfb638a7c51d2d1d270',
            refersToItemNumber: 2,
            body: "yum. I don't think we need study/research descriptions on this one (who studies an apple?) but maybe we could make it a quest item or something.",
        },
        {
            suggestionNumber: 12,            
            author: '664b9bfb638a7c51d2d1d270',
            refersToItemNumber: 3,
            body: 'cool birdseed! reduce the price to 1',
        },
        {
            suggestionNumber: 13,            
            author: '664b9bfb638a7c51d2d1d270',
            refersToItemNumber: 4,
            body: 'crummy dagger, good job. reduce the price to 10',
        },
        {
            suggestionNumber: 14,            
            author: '664b9bfb638a7c51d2d1d270',
            refersToItemNumber: 5,
            body: 'we should put 5 apples in the bin instead of 1',
        },
    ],
};

export default sampleZone;