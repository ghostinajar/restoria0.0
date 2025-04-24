const WEARABLE_LOCATION = {
    ARMS: "arms",
    BODY: "body",
    EARS: "ears",
    FEET: "feet",
    FINGER1: "finger1",
    FINGER2: "finger2",
    HANDS: "hands",
    HEAD: "head",
    LEGS: "legs",
    NECK: "neck",
    SHIELD: "shield",
    SHOULDERS: "shoulders",
    WAIST: "waist",
    WRIST1: "wrist1",
    WRIST2: "wrist2",
};
export const WEARABLE_LOCATION_VALUES = Object.values(WEARABLE_LOCATION);
export const DEFAULT_WEARABLE_LOCATIONS = {
    head: false,
    ears: false,
    neck: false,
    shoulders: false,
    body: false,
    arms: false,
    wrist1: false,
    wrist2: false,
    hands: true,
    finger1: false,
    finger2: false,
    waist: false,
    legs: false,
    feet: false,
    shield: false,
};
export function processWearableLocation(location) {
    let processedLocation;
    if (location) {
        processedLocation = WEARABLE_LOCATION_VALUES.find((l) => l.startsWith(location));
    }
    switch (location) {
        case "f1":
            processedLocation = WEARABLE_LOCATION.FINGER1;
            break;
        case "f2":
            processedLocation = WEARABLE_LOCATION.FINGER2;
            break;
        case "w1":
            processedLocation = WEARABLE_LOCATION.WRIST2;
            break;
        case "w2":
            processedLocation = WEARABLE_LOCATION.WRIST2;
            break;
        default:
            break;
    }
    return processedLocation;
}
export default WEARABLE_LOCATION;
