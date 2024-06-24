import worldEmitter from "../model/classes/WorldEmitter.js";
import makeMessage from "../types/makeMessage.js";
async function edit(parsedCommand, user) {
    let target = parsedCommand.directObject;
    if (!target) {
        worldEmitter.emit(`messageFor${user.username}`, makeMessage(`rejection`, `Edit what?`));
        return;
    }
    switch (target) {
        case `user`: {
            // TODO alert client to open editUserForm and inject user description content
            worldEmitter.emit(`formPromptFor${user.username}`, {
                form: `editUserForm`,
                examine: user.description.examine,
                study: user.description.study,
                research: user.description.research
            });
        }
        default: {
            worldEmitter.emit(`messageFor${user.username}`, makeMessage(`rejection`, `Edit what?`));
            return;
        }
    }
}
export default edit;
