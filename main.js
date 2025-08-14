const fs = require('fs');

//fs.existsSync('input.txt');
let input = fs.readFileSync('input.txt','utf-8');

let lines = input.split(/\r?\n/);

lines = lines
    .map(line => line.trim())
    .filter(line => line.length != 0);

fs.writeFileSync(`output.json`, JSON.stringify(lines));