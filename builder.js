function builder() {
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
}

module.exports = {
    builder,
    addRoom,
    addGivenLocation,
    addParagraph,
    addPath
};