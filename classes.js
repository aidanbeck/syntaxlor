class Paragraph {
    constructor(text) {
        this.addAlteration("default", text);
    }
    addAlteration(signal, text) {
        this[signal] = text;
    }
}

class Path {
    constructor(buttonPrompt="prompt", targetKey='', paragraphs=[], signals=[], requiredItems=[], givenItems=[], takenItems=[]) {
        this.addAlteration("default", buttonPrompt, targetKey, paragraphs, signals, requiredItems, givenItems, takenItems);
    }
    addAlteration(signal, buttonPrompt="prompt", targetKey='', paragraphs=[], signals=[], requiredItems=[], givenItems=[], takenItems=[]) {
        this[signal] = {};
        this[signal].buttonPrompt = buttonPrompt;
        this[signal].targetKey = targetKey; // key of the room button moves to
        this[signal].paragraphs = paragraphs;
        this[signal].signals = signals;
        this[signal].requiredItems = requiredItems;
        this[signal].givenItems = givenItems;
        this[signal].takenItems = takenItems;
    }
}

class Room {
    constructor(givenLocation = '', paragraphs=[], paths=[]) {
        this.addAlteration("default", givenLocation, paragraphs, paths);
    }
    addAlteration(signal, givenLocation = '', paragraphs=[], paths=[]) {
        this[signal] = {};
        this[signal].givenLocation = givenLocation;
        this[signal].paragraphs = paragraphs;
        this[signal].paths = paths;
    }
}

export { Paragraph, Path, Room };