function getSymbolIndexes(string, syntax) {

    let indexes = [0]; //start of string added even if symbol is abscent.

    for (let index = 1; index < string.length; index++) { // for each character
        for (rule of syntax.rules) {                            // for each rule
            if (string.charAt(index) == rule.symbol) {    //if the character == the rule's symbol (and isn't ignored)
                if (string.charAt(index-1) == "`") { continue; } // skip if preceded by a `
                indexes.push(index);
                // !!! if commentCharacter, don't look for more symbols.
            }
        }
    }
    return indexes;
}

function splitAtSymbols(string, syntax) {

    let lineStatements = [];
    
    let indexes = getSymbolIndexes(string, syntax);
    
    for (let i = 0; i < indexes.length; i++) {
        
        let start = indexes[i];
        let end = string.length;

        if (i+1 != indexes.length) {
            end = indexes[i+1];
        }

        let statement = string.slice(start, end).trim();

        lineStatements.push(statement);
    }

    return lineStatements;
}

function splitAtLines(string) {
    let lines = string.split(/\r?\n/); //split into lines. !!! could I use a regular expression like this to include all dynamic symbols?
    lines = lines.map(line => line.trim()) //remove whitespace
    lines = lines.filter(line => line.length != 0); //remove empty lines
    return lines;
}

function getStatements(string, syntax) {

    let statements = [];

    let lines = splitAtLines(string);
    for (let line of lines) {
        let lineStatements = splitAtSymbols(line, syntax);
        for (let lineStatement of lineStatements) {
            statements.push(lineStatement);
        }
    }

    return statements;
}

function getCommand(statement, syntax) {
    for (let rule of syntax.rules) {
        if (statement.charAt(0) == rule.symbol) {
            let value = statement.slice(1,statement.length).replace('`', '').trim();
            return {function: rule.function, value: value }; // could instead safe the index of each rule?
        }
        if (statement.charAt(0) == syntax.commentCharacter) { //comments
            return {function: () => {}, value: ""}; // empty command
        }
    }
    return {function: syntax.defaultFunction, value: statement.replace('`', '').trim() }; // default/no symbol rule
}

function getCommands(string, syntax) {
    let statements = getStatements(string, syntax);
    let commands = [];
    for (let statement of statements) {
        let command = getCommand(statement, syntax);
        commands.push(command);
    }

    return commands;
}

module.exports = getCommands;