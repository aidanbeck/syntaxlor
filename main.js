const fs = require('fs');

//fs.existsSync('input.txt');
let input = fs.readFileSync('input.txt','utf-8');

let output = {
    title: "output",
    lines: input.split(/\r?\n/)
}

fs.writeFileSync(`output.json`, JSON.stringify(output));