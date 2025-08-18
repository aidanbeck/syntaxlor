const fs = require('fs');
const getCommands = require('./separator');
const syntax = require('./syntax');

let input = fs.readFileSync('input.txt','utf-8');
let commands = getCommands(input, syntax);

function builder(commands, syntax) {
    let object = syntax.templateFunction();

    for (let command of commands) {
        // command.function(command.value,object);
        console.log(command);
    }

    return object;
}

let build = builder(commands,syntax);


console.log(build);

fs.writeFileSync(`output.json`, JSON.stringify(build));