const fs = require('fs');

//fs.existsSync('input.txt');
let input = fs.readFileSync('input.txt','utf-8');


const syntax = [
    {symbol:'#', key: 'roomKey'}, // doesn't have any name in old cove, it's just the key given to the room.
    {symbol:"%", key: 'givenLocation'},
    {symbol:"~", key: 'alteration'}, // functionality will change, used to be a different kind of object that would swap in.
    {symbol:"*", key: 'buttonPrompt'},
    {symbol:">", key: 'targetKey'},
    {symbol:"@", key: 'enableAlter'}, // the name of this might change, it will be a string added to a state list, identifiable as a signal whenever a room is used. Room will detect this string, the alter won't go find the room (probably)
    {symbol:"<", key: 'limit'},
    {symbol:"$", key: 'requiredItem'},
    {symbol:"-", key: 'takenItem'}, // works a bit differently in old cove, used to be "takesItem" variable which changes "requiredItem" behavior. But this allows for easier prototyping, so I'll change functionality to match.
    {symbol:"+", key: 'givenItem'},

    {symbol:"default", key:"paragraphs"},
];

function startsWithoutSymbol(string) {
    for (rule of syntax) {
        if (string.charAt(0) == rule.symbol) {
            return false;
        }
    }
    return true;
}

function getStatementIndexes(string) {

    let indexes = [0]; //start of string added even if symbol is abscent.

    for (let index = 1; index < string.length; index++) { // for each character
        for (rule of syntax) {                            // for each rule
            if (string.charAt(index) == rule.symbol) {    //if the character == the rule's symbol (and isn't ignored)
                if (string.charAt(index-1) == "`") { continue; } // skip if preceded by a `
                indexes.push(index);
            }
        }
    }
    return indexes;
}

function separateStatements(string) {

    let statements = [];
    
    let indexes = getStatementIndexes(string);
    
    for (let i = 0; i < indexes.length; i++) {
        
        let start = indexes[i];
        let end = string.length;

        if (i+1 != indexes.length) {
            end = indexes[i+1];
        }

        let statement = string.slice(start, end);

        statements.push(statement);
    }

    return statements;
}

function getStatements(string) {

    let lines = string.split(/\r?\n/); //split into lines
    lines = lines.map(line => line.trim()) //remove whitespace
    lines = lines.filter(line => line.length != 0); //remove empty lines

    let statements = [];

    for (let line of lines) {
        let lineStatements = separateStatements(line);
        for (let statement of lineStatements) {
            statements.push(statement);
        }
    }

    return statements;
}

let output = getStatements(input);
console.log(output);

fs.writeFileSync(`output.json`, JSON.stringify(output));