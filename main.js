const fs = require('fs');
const getCommands = require('./separator');

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

let output = getCommands(input, syntax);
console.log(output);

fs.writeFileSync(`output.json`, JSON.stringify(output));