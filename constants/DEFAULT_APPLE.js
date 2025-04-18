import mongoose from "mongoose";
import COMPLETION_STATUS from "./COMPLETION_STATUS.js";
export const DEFAULT_APPLE = {
    _id: new mongoose.Types.ObjectId(),
    author: new mongoose.Types.ObjectId("665bc7ca1eeaedf3a5da7446"),
    fromZone: new mongoose.Types.ObjectId("664f8ca70cc5ae9b173969a8"),
    name: `an apple`,
    itemType: `none`,
    price: 0,
    minimumLevel: 0,
    history: {
        creationDate: new Date(),
        modifiedDate: new Date(),
        completionStatus: COMPLETION_STATUS.DRAFT,
    },
    description: {
        look: `There's a basic apple here.`,
        examine: `It's red and shiny. With this kind of apple, when you've seen one you've seen them all.`,
    },
    tags: {
        cleric: true,
        mage: true,
        rogue: true,
        warrior: true,
        moon: true,
        neutral: true,
        sun: true,
        guild: false,
        food: true,
        lamp: false,
        hidden: false,
        fixture: false,
        quest: false,
        temporary: false,
        container: false,
    },
    keywords: ["apple"],
    tweakDuration: 182,
};
