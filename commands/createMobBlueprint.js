// createMobBlueprint
import makeMessage from "../types/makeMessage.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import logger from "../logger.js";
import mongoose from "mongoose";
import COMPLETION_STATUS from "../constants/COMPLETION_STATUS.js";
import truncateDescription from "../util/truncateDescription.js";
import look from "./look.js";
// Return room, or a message explaining failure (if by author, emit message to their socket)
async function createMobBlueprint(mobFormData, author) {
    try {
        let message = makeMessage("rejection", ``);
        logger.debug(`Trying to create mob blueprint ${mobFormData.name}.`);
        // let originRoom : IRoom = await getRoomOfUser(author);
        // if (!originRoom) {
        //   logger.error(`Couldn't find origin room to create room.`);
        // }
        let originZone = await new Promise((resolve) => {
            worldEmitter.once(`zone${author.location.inZone.toString()}Loaded`, resolve);
            worldEmitter.emit(`zoneRequested`, author.location.inZone.toString());
        });
        if (!originZone) {
            logger.error(`Couldn't find origin zone to create room.`);
        }
        const mobDescription = {
            look: mobFormData.description.look,
            examine: mobFormData.description.examine,
            study: mobFormData.description.study,
            research: mobFormData.description.research,
        };
        truncateDescription(mobDescription, author);
        let newMobBlueprint = {
            _id: new mongoose.Types.ObjectId(),
            author: author._id,
            name: mobFormData.name,
            pronouns: mobFormData.pronouns,
            history: {
                creationDate: new Date(),
                modifiedDate: new Date(),
                completionStatus: COMPLETION_STATUS.DRAFT,
            },
            level: mobFormData.level,
            job: mobFormData.job,
            statBlock: mobFormData.statBlock,
            goldHeld: 0,
            isUnique: mobFormData.isUnique,
            isMount: mobFormData.isMount,
            isAggressive: mobFormData.isAggressive,
            chattersToPlayer: false,
            emotesToPlayer: false,
            description: mobFormData.description,
            keywords: mobFormData.keywords.split(' '),
            affixes: [],
            chatters: [],
            emotes: [],
            itemNodes: [],
        };
        logger.debug(`createMobBlueprint made newMobBlueprint: ${JSON.stringify(newMobBlueprint)}`);
        originZone.mobBlueprints.push(newMobBlueprint);
        await originZone.save();
        await originZone.initRooms();
        logger.debug(`Saved zone ${originZone.name} with mob blueprints for ${originZone.mobBlueprints.map(mob => mob.name)}`);
        logger.info(`Author "${author.name}" created mob blueprint "${newMobBlueprint.name}".`);
        message.type = "success";
        message.content = `You created a mob blueprint for ${newMobBlueprint.name}. To use blueprints, type 'place mob' or 'remove mob'.`;
        worldEmitter.emit(`messageFor${author.username}`, message);
        await look({ commandWord: 'look' }, author);
        return newMobBlueprint;
    }
    catch (error) {
        logger.error(`Error in createMobBlueprint: ${error.message} `);
        throw error;
    }
}
export default createMobBlueprint;
