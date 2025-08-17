function isEligibleParent(parent, command) {
    for (let key of command.rule.parentKeys) {
        if (parent.rule.key == key) { return true; }
    }
    return false;
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
            console.log(`${parent.rule.key} is not a proper parent of ${command.rule.key}`);
            parentChain.pop();
            i--;
            continue;
        } else {
            console.log(`Add ${command.rule.key} to ${parent.rule.key}`);
        }

        if (typeof parent[command.rule.key] == 'undefined') {
            parent[command.rule.key] = [];
        }


        parent[command.rule.key].push(command);

        parentChain.push(command);
    }

    return main;
}

module.exports = builder;