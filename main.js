const fs = require('fs');
const getCommands = require('./separator');
const syntax = require('./syntax');

let input = fs.readFileSync('input.txt','utf-8');
let commands = getCommands(input, syntax);

function builder(commands, syntax) {
    let object = syntax.templateFunction();
    for (let command of commands) {
        command.function(command.value, object);
        
    }
    object = syntax.finalFunction(object);

    return object;
}

let build = builder(commands,syntax);
fs.writeFileSync(`output.json`, JSON.stringify(build));