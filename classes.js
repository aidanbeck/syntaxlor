class Paragraph {
    constructor(text) {
        this.default = text;
        this.variants = {};
    }
    addVariant(signal, text) {
        let variant = new Paragraph(text);
        this.variants[signal] = variant.default;
    }
}

class Path {
    constructor(buttonPrompt = "prompt", targetRoomKey = '', paragraphs = [], signals = [], requiredItems = [], givenItems = [], takenItems = []) {
        this.default = {
            buttonPrompt,
            targetRoomKey,
            paragraphs,
            signals,
            requiredItems,
            givenItems,
            takenItems
        }
        this.variants = {};
    }
    addVariant(signal, buttonPrompt = "prompt", targetRoomKey = '', paragraphs = [], signals = [], requiredItems = [], givenItems = [], takenItems = []) {
        let variant = new Path(buttonPrompt, targetRoomKey, paragraphs, signals, requiredItems, givenItems, takenItems);
        this.variants[signal] = variant.default;
    }
}

class Room {
    constructor(givenLocation = '', paragraphs = [], paths = []) {
        this.default = {
            givenLocation,
            paragraphs,
            paths
        }
        this.variants = {};
        
    }
    addVariant(signal, givenLocation = '', paragraphs = [], paths = []) {
        let variant = new Room(givenLocation, paragraphs, paths);
        this.variants[signal] = variant.default;
    }
}

export { Paragraph, Path, Room };