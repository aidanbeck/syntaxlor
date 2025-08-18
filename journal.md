## The Problems

Currently I have a function to break the text down into commands, which are rule value pairs.
Each rule has a list of "acceptable parents", and a value will become the child of a parent if it is acceptable,
with its own array for its potential children.

This leads to issues. Not every command should create an array, some should create objects of keys.
Also, some commands should have a different parent depending on the situation. A paragraph should have the
"room" parent, unless its under an option, then it should be the child of that option.

"rooms" themselves should also not even really be values, just the key itself. And an option's value is actually its button prompt value, not its key. I am wanting the rules to be more customizable, and it is difficult to make one build system that accounts for all of these specifics.

## The New Idea

Instead of a single builder, each command will correspond to its own function, and the value will be input into the function.
It might be good to also have one or two global variables defining the most recently created room and paths.

---

## TO-DO
- ~~ Add altered paragraph support ~~
- ~~ Add altered path support ~~
- ~~ Add altered room support ~~
- ~~ ignorable characters ~~