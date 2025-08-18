const syntax = {
    templateFunction: origin,
    defaultFunction: addParagraph,
    rules: [
        {symbol:'#', function: addRoom},
        {symbol:"%", function: addGivenLocation},
        {symbol:"*", function: addPath},
        {symbol:">", key: 'targetKey'},
        {symbol:"@", key: 'enableAlters'},
        {symbol:"<", key: 'limit'},
        {symbol:"$", key: 'requiredItem'},
        {symbol:"-", key: 'takenItem'},
        {symbol:"+", key: 'givenItem'}
    ]
};

function origin(commands, syntax) {
    let object = {
        build: {
            recentRoom: null, //pointer to the most recent room
            recentPath: null, //pointer to the most recent path
            mostRecent: null //pointer to the most recent path OR room
            // might need most recent paragraph for alternate paragraphs
        },
        rooms: {}
    };

    return object;
}

function addRoom(input, object) {
    object.rooms[input] = {
        givenLocations:[],
        paragraphs: [],
        paths: []
    };
    object.build.recentRoom = object.rooms[input];
    object.build.mostRecent = object.rooms[input];
}

function addGivenLocation(input, object) {
    object.build.recentRoom.givenLocations.push(input);
}

function addParagraph(input, object) {
    let paragraph = { "default": input };
    object.build.mostRecent.paragraphs.push(paragraph);
}

function addPath(input, object) {
    let path = {
        targetKey: "",
        buttonPrompt: input,
        paragraphs: [],
        alterations: [],
        limit: Infinity,
        requiredItems: [],
        givenItems: [],
        takenItems: []
    }
    object.build.recentRoom.paths.push(path);

    object.build.recentPath = object.rooms.recentRoom.paths.at(-1); //most recent path
    object.build.mostRecent = object.rooms.recentRoom.paths.at(-1); //most recent path
}

module.exports = syntax;