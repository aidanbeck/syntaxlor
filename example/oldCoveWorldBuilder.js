const fs = require('fs');
const oldCoveSyntax = require('./oldCoveSyntax.js');
const customSyntax = oldCoveSyntax.customSyntax;
const build = oldCoveSyntax.build;

let fileName = "demo";
let inputFilePath = `${fileName}.txt`;
let outputFilePath = `${fileName}.json`;

let input = fs.readFileSync(inputFilePath,'utf-8');
let output = build(input, customSyntax);

fs.writeFileSync(outputFilePath, JSON.stringify(output));