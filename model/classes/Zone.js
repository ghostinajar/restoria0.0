import mongoose from 'mongoose';
const { Schema } = mongoose;

try {
    const historySchema = new Schema({
        creationDate: {
            type: Date,
            default: Date.now
        },
        modifiedDate: {
            type: Date,
            default: Date.now
        },
        completionDate: {
            type: Date,
            default: Date.now
        },
        completionStatus: String,
    });

    const EchoSchema = new Schema({
        echoToOriginRoom: String,
        echoToDestinationRoom: String,
        echoToUser: String,
    });

    const ExitSchema = new Schema({
        destinationRoomNumber: Number,
        isHidden: Boolean,
        isClosed: Boolean,
        isLocked: Boolean,
        keyItemId: Number,
        echoes: {
            unlock: EchoSchema,
            open: EchoSchema,
            close: EchoSchema,
        },
    });

    const DescriptionSchema = new Schema({
        look: String,
        examine: String,
        study: String,
        research: String
    });

    const SuggestionSchema = new Schema({
        suggestionNumber: Number,
        author: {
            type: Schema.Types.ObjectId,
            ref: 'StoredUser'
        },
        refersToRoomNumber: Number,
        refersToMobNumber: Number,
        refersToItemNumber: Number,
        body: String,
        history: historySchema,
    });

    const MobNodeSchema = new Schema({
        mobNumber: Number,
        quantity: Number
    });

    const ItemNodeSchema = new Schema({
        itemNumber: Number,
        quantity: Number
    });

    const AffixNodeSchema = new Schema({
        affixType: String,
        value: Number,
    });

    const RoomSchema = new Schema({
            roomNumber: Number,
            author: {
                type: Schema.Types.ObjectId,
                ref: 'StoredUser'
            },
            roomType: String,
            name: String,
            history: historySchema,
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
            itemNumbersForSale: [Number], 
            mountNumbersForSale: [Number], 
            //mapCoord at "centre" of zone is 39,39,0 (so map can be loaded from 0,0 out to 79,79)
            mapCoords: {
                x: Number,
                y: Number,
                z: Number,
            },
            description: DescriptionSchema,
            exits: {
                north: ExitSchema,
                south: ExitSchema,
                east: ExitSchema,
                west: ExitSchema,
                up: ExitSchema,
                down: ExitSchema,
            },
            mobNodes: [MobNodeSchema],            
            itemNodes: [ItemNodeSchema],
    });

    const ChatterSchema = new Schema({
        name: String,
        text: String,
    });

    const EmoteSchema = new Schema({
        name: String,
        text: String,
    });

    const MobSchema = new Schema({
        mobNumber: Number,
        author: {
            type: Schema.Types.ObjectId,
            ref: 'StoredUser'
        },
        name: String,
        pronouns: Number, // 0 = it/it, 1 = he/him, 2 = she/her, 3 = they/them
        history: historySchema,
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
        chattersToPlayer: Boolean,
        emotesToPlayer: Boolean,
        description: DescriptionSchema,
        keywords: [String],
        affixNodes: [AffixNodeSchema],
        chatters: [ChatterSchema], 
        emotes: [EmoteSchema],
        itemNodes: [ItemNodeSchema],
    });

    const ItemSchema = new Schema({
        itemNumber: Number,
        author: {
            type: Schema.Types.ObjectId,
            ref: 'StoredUser'
        },
        name: String,
        itemType: String,
        price: Number,
        capacity: Number,
        levelRestriction: Number,
        history: historySchema,
        description: DescriptionSchema,
        weaponStats: {
            damageDieSides: Number,
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
        affixNodes: [AffixNodeSchema],
        tweakDuration: {
            type: Number,
            default: 182,
        }, 
        itemNodes: [ItemNodeSchema],
    });

    const storedZoneSchema = new Schema({
        zoneNumber: Number,
        author: {
            type: Schema.Types.ObjectId,
            ref: 'StoredUser'
        },
        name: String,
        history: historySchema,
        description: DescriptionSchema,
        rooms: [RoomSchema],
        mobs: [MobSchema],
        items: [ItemSchema],
        suggestions: [SuggestionSchema],
    });

    const StoredZone = mongoose.model('StoredZone', storedZoneSchema);
} catch(err) {console.log(err)};

export default StoredZone;
