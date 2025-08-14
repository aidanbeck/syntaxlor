const fs = require('fs');

//fs.existsSync('input.txt');
let input = fs.readFileSync('input.txt','utf-8');


const syntax = [
    {symbol:'#', key: 'roomKey'},
    {symbol:"%", key: 'locationKey'},
    {symbol:"~", key: 'alterationKey'},
    {symbol:"*", key: 'prompt'},
    {symbol:">", key: 'pathKey'},
    {symbol:"@", key: 'enableAlter'},
    {symbol:"<", key: 'limit'},
    {symbol:"$", key: 'needs'},
    {symbol:"-", key: 'takes'},
    {symbol:"+", key: 'gives'},


    {symbol:"default", key:"paragraphs"},
];


let lines = input.split(/\r?\n/); //split array into lines
lines = lines.map(line => line.trim()) //remove whitespace
lines = lines.filter(line => line.length != 0); //remove empty lines

function getSymbolIndexes(string) {
    let symbolIndexes = [];

    let startsWithoutSymbol = true;

    for (let index = 0; index < string.length; index++) { // for each character

        

        for (rule of syntax) {                            // for each rule
            if (string.charAt(index) == rule.symbol && string.charAt(index-1) != "\\") { //if the character == the rule's symbol (and isn't ignored)
                symbolIndexes.push({key: rule.key, index: index});  // push the rule's key and symbol's index
                startsWithoutSymbol = false;
            }
        }
    }

    if (startsWithoutSymbol) {
        symbolIndexes.unshift([{key: "default", index:0}]);
    }

    return symbolIndexes;
}

function getLineStatements(string) {

    let statements = [];
    
    let symbolIndexes = getSymbolIndexes(string);
    
    for (let i = 0; i < symbolIndexes.length; i++) {
        
        let start = symbolIndexes[i].index;
        let end = string.length;

        if (i+1 != symbolIndexes.length) {
            end = symbolIndexes[i+1].index;
        }

        let statement = string.slice(start, end);

        statements.push(statement);
    }

    return statements;
}

let output = [];

for (let line of lines) {
    let statements = getLineStatements(line);
    output.push(statements);
}

console.log(output);

fs.writeFileSync(`output.json`, JSON.stringify(output));