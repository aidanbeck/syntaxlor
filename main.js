const fs = require('fs');
const getCommands = require('./separator');
const builder = require('./builder');

const syntax = {
    default: {symbol:"default", key:"paragraphs", parentKeys:["rooms", "buttonPrompt"]},
    rules: [
        {symbol:'#', key: 'rooms', parentKeys:["main"]}, // doesn't have any name in old cove, it's just the key given to the room.
        {symbol:"%", key: 'givenLocations', parentKeys: ["rooms"]},
        // {symbol:"~", key: 'alteration', parentKeys:["rooms","paragraph","buttonPrompt"]}, // functionality will change, used to be a different kind of object that would swap in.
        {symbol:"*", key: 'buttonPrompt', parentKeys:["rooms"]},   //not an array
        {symbol:">", key: 'targetKey', parentKeys:["buttonPrompt"]}, //not an array
        {symbol:"@", key: 'enableAlters', parentKeys:["buttonPrompt"]}, // the name of this might change, it will be a string added to a state list, identifiable as a signal whenever a room is used. Room will detect this string, the alter won't go find the room (probably)
        {symbol:"<", key: 'limit', parentKeys:["buttonPrompt"]}, //not an array
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