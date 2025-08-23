const syntax = {
    templateFunction: origin, //returns initial object
    finalFunction: final, //implements any last changes
    defaultFunction: addParagraph,
    rules: [
        {symbol:'#', function: addRoom},
        {symbol:"%", function: addGivenLocation},
        {symbol:"*", function: addPath},
        {symbol:"~", function: addAlteration},
        {symbol:">", function: setTargetKey},
        {symbol:"<", function: setLimit},
        {symbol:"@", function: addChangeSignal},
        {symbol:"$", function: addRequiredItem},
        {symbol:"-", function: addTakenItem},
        {symbol:"+", function: addGivenItem},
        {symbol:">", function: comment}
    ]
};

function origin(commands, syntax) {
    let object = {
        build: {
            latestRoom: null, //reference to the most recent room
            latestPath: null, //reference to the most recent path
            latestEither: null //reference to the most recent path OR room
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

// Helper Functions
function getLatestRoom(object) {
    return object.build.latestRoom;
}
function getLatestPath(object) {
    return object.build.latestPath;
}
function getLatest(object) {
    return object.build.latestEither;
}

function addRoom(input, object) {

    let key = input;
    if (getLatestRoom(object)?.key == input) { key += "_" } //avoid overwriting. Will eventually be erased and put into the original as an alteration.

    object.rooms[key] = {
        "default": {
            key: input, // needed to create default targetKey. There may be a way around this.
            givenLocations:[],
            paragraphs: [],
            paths: []
        }  
    };
    object.build.latestRoom = object.rooms[key]["default"];
    object.build.latestEither = object.rooms[key]["default"];
}

function addGivenLocation(input, object) {
    getLatestRoom(object).givenLocations.push(input);
}

function addParagraph(input, object) {
    if (input == "Empty") { input = "" }; // wipe paragraph if using "Empty" keyword
    let paragraph = { "default": input };
    getLatest(object).paragraphs.push(paragraph);
}

function addAlteration(input, object) { // This is a monster and should be refactored someday. Value not equivalent to the time investment right now.

    if (getLatest(object).paragraphs.length > 0) { // Alter Latest Paragraph
        let firstSpace = input.indexOf(' ');
        let changeSignal = input.slice(0,firstSpace);
        let alteredString = input.slice(firstSpace).trim();
        let mostRecentParagraphs = getLatest(object).paragraphs.at(-1);
        mostRecentParagraphs[changeSignal] = alteredString;

    } else if ('targetKey' in getLatest(object)) { // Alter Latest Path
        
        // First a path is defined with `*Prompt Text`, THEN a `~signalName` is used to define that path as an alteration retroactively.
        // Therefore, the path we want to make into an alteration already exists as a path.
        // We should assume that the path above *THAT* path is the default/original.

        let roomContainingPaths = getLatestRoom(object);
        let alterationPath = getLatestPath(object);
        let originalPathIndex = -2;
        
        // Copy the newly created "default" path over as an alternate of the path before it.
        roomContainingPaths.paths.at(originalPathIndex)[input] = {
            targetKey: alterationPath.targetKey,
            buttonPrompt: alterationPath.buttonPrompt,
            paragraphs: alterationPath.paragraphs,
            changeSignals: alterationPath.changeSignals,
            limit: alterationPath.limit,
            requiredItems: alterationPath.requiredItems,
            givenItems: alterationPath.givenItems,
            takenItems: alterationPath.takenItems,
        };

        roomContainingPaths.paths.pop(); // remove temporary alteration path's unique spot

        object.build.latestPath = getLatestRoom(object).paths.at(-1)[input]; //most recent path
        object.build.latestEither = getLatestRoom(object).paths.at(-1)[input]; //most recent path

    } else { // Alter Latest Room

        // in the text, `#roomKey` will appear before `~signalName`. It will already be defined in the list of rooms.
        // because `#roomkey# will have the same key as the original room, the room creator adds a '_' to avoid overwriting it.
        // This block will:
        // - assume that the latest room is meant to be an alteration
        // - add it as a variation of the original room (room with the same key, but without the _)
        // - remove the temporary alteration room
        // - set the variation room as the latest room


        let alterationRoom = getLatestRoom(object);
        let originalRoom = object.rooms[alterationRoom.key];
        
        originalRoom[input] = {
            key: alterationRoom.key,
            givenLocations: alterationRoom.givenLocations,
            paragraphs: alterationRoom.paragraphs,
            paths: alterationRoom.paths
        };

        let temporaryKey = alterationRoom.key + "_"
        delete object.rooms[temporaryKey];

        object.build.latestRoom = originalRoom[input];
        object.build.latestEither = originalRoom[input];
        
    }

}

function addPath(input, object) {
    let path = {
        "default": {
            targetKey: getLatestRoom(object).key, //most recent room is the default. Should this be defined here, or should an empty string indicate to the navigation function that the current room should be navigated to?
            buttonPrompt: input,
            paragraphs: [],
            changeSignals: [],
            limit: null,
            requiredItems: [],
            givenItems: [],
            takenItems: [],
        }
    }
    getLatestRoom(object).paths.push(path);

    object.build.latestPath = getLatestRoom(object).paths.at(-1)["default"]; //most recent path
    object.build.latestEither = getLatestRoom(object).paths.at(-1)["default"]; //most recent path
}

function setTargetKey(input, object) {
    getLatestPath(object).targetKey = input;
}

function setLimit(input, object) {
    getLatestPath(object).limit = Number(input);
}

function addChangeSignal(input, object) {
    getLatestPath(object).changeSignals.push(input);
}

function addRequiredItem(input, object) {
    getLatestPath(object).requiredItems.push(input);
}

function addGivenItem(input, object) {
    getLatestPath(object).givenItems.push(input);
}

function addTakenItem(input, object) {
    getLatestPath(object).takenItems.push(input);
}

function comment(input, object) {
    console.log(input); // will delete this, but could be good for debugging syntaxlor
                        // eventually this should probably be a blank function
}

module.exports = syntax;