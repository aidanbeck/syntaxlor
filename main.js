import { getCommands } from './separator.js';

class Syntax {
    constructor(initialFunction, finalFunction, defaultFunction, commentSymbol = '/') {
        this.initialFunction = initialFunction; // function to set up object
        this.finalFunction = finalFunction;     // function to make any last changes to object
        this.defaultFunction = defaultFunction; // function run when there is no symbol
        this.commentSymbol = commentSymbol,     // symbol to not run a function (for comments within syntax)
        this.rules = [];
    }
    addRule(symbol, ruleFunction) {
        this.rules.push({symbol, ruleFunction});
    }
}

function runCommands(commands, syntax) {
    let object = syntax.initialFunction();
    for (let command of commands) {
        command.commandFunction(command.value, object);
        
    }
    object = syntax.finalFunction(object);

    return object;
}

function build(input, syntax) {
    let commands = getCommands(input, syntax);
    return runCommands(commands, syntax);
}

export { Syntax, build };