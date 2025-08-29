class Item {
    constructor(name, paragraphs=["This item doesn't have a description."]) { // takes strings for paragraphs input, not actual Paragraph classes
        this.name = name;
        this.paragraphs = [];
        for (let i = 0; i < paragraphs.length; i++) {
            this.paragraphs[i] = new Paragraph(paragraphs[i]); // does not currently allow for alternate items- might add later.
        }
    }
}

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

class World {
    constructor(rooms = {}, items={}, signals=[], inventory=[], locations=[], position) {

        //STATIC
        this.rooms = rooms; // object of rooms objects. Not an array, the keys are used to identify each room.
        this.items = items; // object of item objects. Keys are used to identify each item.

        //DYNAMIC
        this.signals = signals; // array of state-changing signal strings. 
        this.inventory = inventory; // array of item key strings.
        this.locations = locations; // a list of titles/ids the user has collected and can revisit
        this.lastLocation = ''; // this is the last *collected* id/title the player *visited*. It exists to highlight their most recently visited location.
        this.positon = position; // the targetKey of the room the user is in
        this.positionRoom; // a reference to the room object the user is currently in.
        this.moveTo(position); // updates positionRoom and adds location if it is needed
    }

    getAlteration(alterations) { // retrieves the proper alteration of a Room, Path, or Paragraph
        for (let signal of this.signals) {
            if (signal in alterations) { // if corresponding alteration exists
                return alterations[signal]; // !!! does not account for competing alterations
            }
        }
        return alterations["default"];
    }

    showPathParagraphs(path) {
        let alterationPath = this.getAlteration(path);

        if (alterationPath.paragraphs.length == 0) { return; } // don't describe if path has no description.

        let returnKey = alterationPath.targetKey; // room returned to after description
        new Path("Continue.", returnKey);
        this.rooms["description-path"] = new Room('', alterationPath.paragraphs, [continuePath]); // create a new room with the paragraphs and a simple continue.
        this.moveTo("description-path");

        //this is messy, return to clean up if I have time.
        //could be more clean, but I have a deadline.
    }

    showItemParagraphs(item) {
        
        let returnKey = this.position;

        if (this.position == "description-item") { // if user is already reading an item,
            returnKey = this.positionRoom.paths[0]["default"].targetKey; // don't return to that item, return to what that item is returning to
        }

        // otherwise it's the same hacky method as before.
        let continuePath = new Path("...", returnKey);
        this.rooms["description-path"] = new Room('', item.paragraphs, [continuePath]); // should there be alterationItems?
        this.moveTo("description-item");
    }

    hasItem(itemKey) {
        return this.inventory.includes(itemKey);
    }
    giveItems(items) {
        for (let itemKey of items) {
            if (this.hasItem(itemKey)) { return; } // prevents having the same item twice
            this.inventory.push(itemKey);
        }
    }

    hasLocation(key) {
        return this.locations.includes(key);
    }
    giveLocation(key) {

        if (key == '') { return; } // block empty location strings

        this.lastLocation = key;

        if (this.hasLocation(key)) { return; } // block duplicate location strings

        this.locations[this.locations.length] = key;
    }

    moveTo(roomKey) {
        this.position = roomKey;
        this.positionRoom = this.rooms[roomKey];
        let roomAlteration = this.getAlteration(this.positionRoom);
        this.giveLocation(roomAlteration.givenLocation);
    }
    isValidPath(pathIndex) { // true if user and path meet all requirements to select the path
        let roomAlteration = this.getAlteration(this.positionRoom);
        let path = roomAlteration.paths[pathIndex];
        let pathAlteration = this.getAlteration(path);

        // Get Conditionals
        let playerHasTakenItems = true;
        for (let item of pathAlteration.takenItems) {
            if (!this.hasItem(item)) {
                playerHasTakenItems = false;
            }
        }

        let playerHasRequiredItems = true;
        for (let item of pathAlteration.requiredItems) {
            if (!this.hasItem(item)) {
                playerHasRequiredItems = false;
            }
        }

        let playerHasGivenItems = false;
        for (let item of pathAlteration.givenItems) {
            if (this.hasItem(item)) {
                playerHasGivenItems = true;
            }
        }
        
        if (playerHasTakenItems && playerHasRequiredItems && !playerHasGivenItems) {
            return true;
        }
        
        return false;
    }
    choosePath(index) {
        let roomAlteration = this.getAlteration(this.positionRoom)
        let path = roomAlteration.paths[index];
        let pathAlteration = this.getAlteration(path);
        let pathHasItemsToGive = pathAlteration.givenItems.length > 0;
        let pathHasSignalsToGive = pathAlteration.signals.length > 0;

        if (this.isValidPath(index)) {

            //give items
            if (pathHasItemsToGive) { this.giveItems(pathAlteration.givenItems); }

            // take items
            for (let itemKey of pathAlteration.takenItems) {
                let itemIndex = this.inventory.indexOf(itemKey)
                this.inventory.splice(itemIndex,1);
            }

            //give signals
            for (let signal of pathAlteration.signals) {
                if (!this.signals.includes(signal)) {
                    this.signals.push(signal);
                }
            }
            
            if (pathAlteration.paragraphs.length > 0) {
                this.showPathParagraphs(pathAlteration); // describe action of path, then return to room once continue pressed.
            } else {
                this.moveTo(pathAlteration.targetKey); // move without description.
            }
            
        }
    }
}
export { Item, Paragraph, Path, Room, World };