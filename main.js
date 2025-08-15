const fs = require('fs');
const getCommands = require('./separator');
const builder = require('./builder');

const syntax = {
    default: {symbol:"default", key:"paragraphs", parentKeys:["roomkey", "buttonPrompt"]},
    rules: [
        {symbol:'#', key: 'roomKey', parentKeys:["main"]}, // doesn't have any name in old cove, it's just the key given to the room.
        {symbol:"%", key: 'givenLocation', parentKeys: ["roomKey"]},
        {symbol:"~", key: 'alteration', parentKeys:["roomKey","paragraph","buttonPrompt"]}, // functionality will change, used to be a different kind of object that would swap in.
        {symbol:"*", key: 'buttonPrompt', parentKeys:["roomKey"]},
        {symbol:">", key: 'targetKey', parentKeys:["buttonPrompt"]},
        {symbol:"@", key: 'enableAlter', parentKeys:["buttonPrompt"]}, // the name of this might change, it will be a string added to a state list, identifiable as a signal whenever a room is used. Room will detect this string, the alter won't go find the room (probably)
        {symbol:"<", key: 'limit', parentKeys:["buttonPrompt"]},
        {symbol:"$", key: 'requiredItem', parentKeys:["buttonPrompt"]},
        {symbol:"-", key: 'takenItem', parentKeys:["buttonPrompt"]}, // works a bit differently in old cove, used to be "takesItem" variable which changes "requiredItem" behavior. But this allows for easier prototyping, so I'll change functionality to match.
        {symbol:"+", key: 'givenItem', parentKeys:["buttonPrompt"]}
    ]
};

let input = fs.readFileSync('input.txt','utf-8');
let commands = getCommands(input, syntax);
let build = builder(commands);
console.log(build);

fs.writeFileSync(`output.json`, JSON.stringify(build));