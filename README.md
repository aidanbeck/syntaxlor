# syntaxlor
Convert hand-written text files into JSON with **tailored syntax**.

While JSON is human writable, the syntax won't meet every project's exact needs. If you want to write an interactive novel, it would be better to have a tailored syntax that can be converted into JSON.

## Old Cove Examples.
Syntaxlor solves a design program for my text based game [Old Cove](github.com/aidanbeck/old-cove).
The narrative's room & path structure can be defined with JSON or JavaScript, but it is incredibly verbose compared to traditional writing.

**An Example of an Old Cove room**
```
R['lighthouse'] = new Room(
    ['The lighthouse sits on the edge of a cliff, defiantly piercing the seascape behind it.',
        'You try the door, but it seems jammed.'
    ],
    [
        new Path('a road','Return to the road.'),
        new Path('lighthouse','Force it open.', ['You swing the axe at the door- it doesn\'t budge. You try again, harder this time, and it cracks.',
            'The axe head snaps from the end of the handle, embedding itself in the door as it lurches wide open.'
        ], '', axe, true, [
            new AlterDesc('lighthouse', ['The lighthouse sits on the edge of a cliff, defiantly piercing the seascape behind it.', 'The door is wide open, the head of an axe embedded into its front.', 'What used to be a handle is now splinters on the ground.']),
            new AlterPath('lighthouse',2,new Path('lighthouse 2', 'Enter.', ['You hesitate before walking inside.'])),
        ], 1)
    ],
    'lighthouse'
);
```
This room requires horizontal scrolling and memorized function inputs. It requires extensive symbols and formatting.

**The Same Room with Tailored Syntax**
```
#lighthouse %lighthouse
 The lighthouse sits on the edge of a cliff, defiantly piercing the seascape behind it. 
 You try the door, but it seems jammed.  ~breakIn   The door is wide open, the head of an axe embedded into its front.
 Empty                   ~breakIn   What used to be a handle is now splinters on the ground.

*Return to the road. > a road
 You walk back down the road.

*Force it open. -axe @breakIn <1
 You swing the axe at the door— it doesn't budge. You try again, harder this time, and it cracks.
 The axe head snaps from the end of the handle, embedding itself in the door as it lurches wide open.

*Enter. ~breakIn > lighthouse 2
You hesitate before walking inside.
```
This read naturally, and is faster to edit. It streamlines the syntax into single character symbols, and can be learned by non-developers.

**Syntax Symbols Tailored to Old Cove.**
```
#room key        -  the internal "id" of a room.
%given location  -  added to the player's location list.
~alteration      -  a signal that can be listened for to alter text here.
*button prompt   -  creates a new path with the given button prompt.
>target key      -  the "id" of the room the path should go to.

@change signal   -  a signal that can be emitted to alter text elsewhere.
<limit           -  the number of times an option can be chosen.
$required item   -  an item necessary to select an option.
-taken item      -  an item taken upon option selection.
+given item      -  an item given upon option selection.

`*ignored symbol -  a symbol you can use to ignore custom syntax.
empty            -  a keyword used to designate an empty string.
```