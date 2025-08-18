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
        {symbol:"+", function: addGivenItem}
    ]
};

function origin(commands, syntax) {
    let object = {
        build: {
            latestRoom: null, //pointer to the most recent room
            latestPath: null, //pointer to the most recent path
            latestEither: null //pointer to the most recent path OR room
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
    object.rooms[input] = {
        "default": {
            key: input, // needed to create default targetKey. There may be a way around this.
            givenLocations:[],
            paragraphs: [],
            paths: []
        }  
    };
    object.build.latestRoom = object.rooms[input]["default"];
    object.build.latestEither = object.rooms[input]["default"];
}

function addGivenLocation(input, object) {
    getLatestRoom(object).givenLocations.push(input);
}

function addParagraph(input, object) {
    if (input == "Empty") { input = "" }; // wipe paragraph if using "Empty" keyword
    let paragraph = { "default": input };
    getLatest(object).paragraphs.push(paragraph);
}

function addAlteration(input, object) {

    if (getLatest(object).paragraphs.length > 0) { // Alter Latest Paragraph

        let firstSpace = input.indexOf(' ');
        let changeSignal = input.slice(0,firstSpace);
        let alteredString = input.slice(firstSpace).trim();
        let mostRecentParagraphs = getLatest(object).paragraphs.at(-1);
        mostRecentParagraphs[changeSignal] = alteredString;

    } else if ('targetKey' in getLatestRoom(object)) { // Alter Latest Path
        // First a path is defined with `*Prompt Text`, THEN a `~signalName` is used to define that path as an alteration retroactively.
        // Therefore, the path we want to make into an alteration already exists as a path.
        // We should assume that the path above *THAT* path is the default/original.

    } else { // Alter Latest Room

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
            alterations: {}
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

module.exports = syntax;