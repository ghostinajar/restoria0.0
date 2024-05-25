import AFFIX_TYPE from "./constants/AFFIX_TYPE.js";
import DAMAGE_TYPE from "./constants/DAMAGE_TYPE.js";
import COMPLETION_STATUS from "./constants/COMPLETION_STATUS.js";
import ITEM_TAG from "./constants/ITEM_TAG.js";
import ITEM_TYPE from "./constants/ITEM_TYPE.js";
import JOB from "./constants/JOB.js";
import ROOM_TYPE from "./constants/ROOM_TYPE.js";
import WEARABLE_LOCATION from "./constants/WEARABLE_LOCATION.js";

export const rayu = {
    name: 'Rayu',
    pronouns: 1,
    location: {
        inZone: '664f8ca70cc5ae9b173969a8',
        inRoom: '',
        },
    job: 'mage',
    statBlock: {
        strength: 12,
        dexterity: 12,
        constitution: 12,
        intelligence: 14,
        wisdom: 12,
        charisma: 12,
        spirit: 0,
    },
    jobLevels: {
        mage: 1,
    },
    description: {
        examine: "Rayu is a short young man with cropped blue hair. He is dressed in matching cream linen pants and tunic, with brown leather sandals."
    },
    inventory: {},
    equipped: {
    }
}
