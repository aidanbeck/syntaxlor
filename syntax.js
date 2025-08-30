// import { Paragraph, Path, Room } from './classes.js';
const Constructors = require('./classes.js');
const Room = Constructors.Room;
const Path = Constructors.Path;
const Paragraph = Constructors.Paragraph;

const syntax = {
    templateFunction: origin, //returns initial object
    finalFunction: final, //implements any last changes
    defaultFunction: addParagraph,
    commentCharacter: "&",
    rules: [
        {symbol:'#', function: addRoom},
        {symbol:"%", function: setGivenLocation},
        {symbol:"*", function: addPath},
        {symbol:"~", function: addAlteration},
        {symbol:">", function: setTargetKey},
        {symbol:"@", function: addSignal},
        {symbol:"$", function: addRequiredItem},
        {symbol:"-", function: addTakenItem},
        {symbol:"+", function: addGivenItem},
    ]
};

function origin(commands, syntax) {
    let object = {
        build: {
            latestRoom: null, //reference to the most recent room
            latestPath: null, //reference to the most recent path
            latestEither: null, //reference to the most recent path OR room
            latestKey: null // string, used to get the path to the most recently created room.
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
    if (object.build.latestKey == input) { key += "_" } // avoid overwriting rooms. Room_ will eventually be erased and put into the original as an alteration.

    object.rooms[key] = new Room();
    //key: input, // needed to create default targetKey. There may be a way around this.

    object.build.latestRoom = object.rooms[key]["default"];
    object.build.latestEither = object.rooms[key]["default"];
    object.build.latestKey = input; // used for paths that lead to current room.
}

function setGivenLocation(input, object) {
    getLatestRoom(object).givenLocation = input ;
}

function addParagraph(input, object) {
    if (input == "Empty") { input = "" }; // wipe paragraph if using "Empty" keyword
    let paragraph = new Paragraph(input);
    getLatest(object).paragraphs.push(paragraph); // add paragraph to latest path alteration or room alteration
}

function addAlteration(input, object) { // This is a monster and should be refactored someday. Value not equivalent to the time investment right now.

    if (getLatest(object).paragraphs.length > 0) { // Alter Latest Paragraph
        /*
            ^ If there are more than 0 paragraphs in the latest object, a paragraph has been defined for it.
            Therefore, a created alter should alter the most recent paragraph of the object, as that must be the most recently defined alterable.
        */
        let firstSpace = input.indexOf(' ');
        let signal = input.slice(0,firstSpace); //string before the first space, the signal
        let alteredString = input.slice(firstSpace).trim(); //string trimmed after the first space, the rest of the text
        let mostRecentParagraph = getLatest(object).paragraphs.at(-1); // the most recent paragraph object
        mostRecentParagraph.addAlteration(signal, alteredString);

    } else if ('targetKey' in getLatest(object)) { // Alter Latest Path
        /*
            ^if the latest object has a 'targetKey' key, it must be a path.
        */
        
        // First a path is defined with `*Prompt Text`, THEN a `~signalName` is used to define that path as an alteration retroactively.
        // Therefore, the path we want to make into an alteration already exists as a path.
        // We should assume that the path above *THAT* path is the default/original.

        let roomContainingPaths = getLatestRoom(object);
        let alterationPath = getLatestPath(object);
        let originalPathIndex = -2; // negative 2 to skip over the temporary new path, since it will be added and then removed
        
        // Copy the newly created "default" path over as an alternate of the path before it.
        let originalPath = roomContainingPaths.paths.at(originalPathIndex);
        originalPath.addAlteration(input, alterationPath.buttonPrompt, alterationPath.targetKey, alterationPath.paragraphs, alterationPath.signals, alterationPath.requiredItems, alterationPath.givenItems, alterationPath.takenItems);

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
        let originalRoom = object.rooms[object.build.latestKey];

        originalRoom.addAlteration(input, alterationRoom.givenLocation, alterationRoom.paragraphs, alterationRoom.paths);

        let temporaryKey = object.build.latestKey + "_"
        delete object.rooms[temporaryKey]; // delete alterationRoom

        object.build.latestRoom = originalRoom[input];
        object.build.latestEither = originalRoom[input];
        
    }

}

function addPath(input, object) {
    let path = new Path(input, object.build.latestKey);

    getLatestRoom(object).paths.push(path);

    object.build.latestPath = getLatestRoom(object).paths.at(-1)["default"]; //most recent path
    object.build.latestEither = getLatestRoom(object).paths.at(-1)["default"]; //most recent path
}

function setTargetKey(input, object) {
    getLatestPath(object).targetKey = input;
}

function addSignal(input, object) {
    getLatestPath(object).signals.push(input);
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
                        // eventually this should probably be a blank anonymous function
}

module.exports = syntax;
// export default syntax;