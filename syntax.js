const syntax = {
    templateFunction: origin, //returns initial object
    finalFunction: final, //implements any last changes
    defaultFunction: addParagraph,
    rules: [
        {symbol:'#', function: addRoom},
        {symbol:"%", function: addGivenLocation},
        {symbol:"*", function: addPath},
        {symbol:">", function: setTargetKey},
        {symbol:"<", function: setLimit},
        {symbol:"@", function: addAlteration},
        {symbol:"$", function: addRequiredItem},
        {symbol:"-", function: addTakenItem},
        {symbol:"+", function: addGivenItem}
    ]
};

function origin(commands, syntax) {
    let object = {
        build: {
            recentRoom: null, //pointer to the most recent room
            recentPath: null, //pointer to the most recent path
            mostRecent: null //pointer to the most recent path OR room
            // might need most recent paragraph for alternate paragraphs
            // should these store references or keys?
        },
        rooms: {}
        //position
        //locations
        //items
        //lastLocation
        //positionRoom
        //alteration state list
    };

    return object;
}

function final(object) {
    delete object.build;
    return object;
}

function addRoom(input, object) {
    object.rooms[input] = {
        key: input, // needed to create default targetKey. There may be a way around this.
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
        targetKey: object.build.recentRoom.key, //most recent room is the default
        buttonPrompt: input,
        paragraphs: [],
        alterations: [],
        limit: null,
        requiredItems: [],
        givenItems: [],
        takenItems: []
    }
    object.build.recentRoom.paths.push(path);

    object.build.recentPath = object.build.recentRoom.paths.at(-1); //most recent path
    object.build.mostRecent = object.build.recentRoom.paths.at(-1); //most recent path
}

function setTargetKey(input, object) {
    object.build.recentPath.targetKey = input;
}

function setLimit(input, object) {
    object.build.recentPath.limit = Number(input);
}

function addAlteration(input, object) {
    object.build.recentPath.alterations.push(input);
}

function addRequiredItem(input, object) {
    object.build.recentPath.requiredItems.push(input);
}

function addGivenItem(input, object) {
    object.build.recentPath.givenItems.push(input);
}

function addTakenItem(input, object) {
    object.build.recentPath.takenItems.push(input);
}

module.exports = syntax;