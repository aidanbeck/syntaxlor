const fs = require('fs');
const oldCoveSyntax = require('./oldCoveSyntax.js');
const customSyntax = oldCoveSyntax.customSyntax;
const build = oldCoveSyntax.build;

let inputFilePaths = [
    "demo.txt",
    "hospital.txt"
];

let input = '';

for (let inputFilePath of inputFilePaths) {
    input += fs.readFileSync(inputFilePath,'utf-8');
    input += '\n';
}

let output = build(input, customSyntax);

fs.writeFileSync("rooms.json", JSON.stringify(output));