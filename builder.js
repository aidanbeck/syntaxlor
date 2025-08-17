function isEligibleParent(parent, command) {
    for (let key of command.rule.parentKeys) {
        if (parent.rule.key == key) { return true; }
    }
    return false;
}

function converter(main) {
    delete main.rule;

    let reKeyed = {}

    for (let room of main.rooms) {
        console.log(room.value);
        reKeyed[room.value] = room;
        delete reKeyed[room.value].rule;
        delete reKeyed[room.value].value; //this needs to be deleted last so the room can be identified
    }

    return reKeyed;
}

function builder(commands) {
    let main = {
        rule: {
            key: "main"
        }
    };

    let parentChain = [main];

    for (let i = 0; i < commands.length; i++) {

        let command = commands[i];

        let parent = parentChain[parentChain.length - 1];

        if (!isEligibleParent(parent, command)) {
            parentChain.pop();
            i--;
            continue;
        }

        if (typeof parent[command.rule.key] == 'undefined') {
            parent[command.rule.key] = [];
        }


        parent[command.rule.key].push(command);

        parentChain.push(command);
    }

    return converter(main);
}

module.exports = builder;