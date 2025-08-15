function isEligibleParent(parentKeys, parent) {
    for (let key of parentKeys) {
        if (parent == key) { return true; }
    }
    return false;
}

function builder(commands) {
    let main = {};

    let lastElement = main;

    for (let i = 0; i < commands.length; i++) {
        let command = commands[i];

        lastElement[command.rule.key] = { value: command.value };
        lastElement = lastElement[command.rule.key];
    }

    return main;
}

module.exports = builder;