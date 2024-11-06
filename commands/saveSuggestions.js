async function saveSuggestions(suggestions, zone) {
    console.log(zone.name);
    console.log(suggestions);
    zone.suggestions = suggestions;
    await zone.save();
}
export default saveSuggestions;
