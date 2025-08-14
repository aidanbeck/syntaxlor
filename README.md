# syntaxlor
A program for converting handwritten text files with tailored syntax into JSON objects.

While JSON is human readible and writable, the syntax won't meet every project's exact needs. If you want to write an interactive novel, it would be better to have a tailored syntax that can be converted into JSON.


## Old Cove Examples.
Syntaxlor solves a design program for my text based game [Old Cove](github.com/aidanbeck/old-cove).
The narrative's room & path structure can be defined with JSON, but it is incredibly verbose. Writing directly in JavaScript allowed me to use helper functions, which alleviates this but left much to be desired.


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
 Empty 					 ~breakIn   What used to be a handle is now splinters on the ground.

*Return to the road. > a road
 You walk back down the road.

*Force it open. -axe @breakIn <1
 You swing the axe at the door- it doesn't budge. You try again, harder this time, and it cracks.
 The axe head snaps from the end of the handle, embedding itself in the door as it lurches wide open.

*Empty					 ~breakIn Enter. > lighthouse 2
 					      You hesitate before walking inside.
```
This room is more readible, and faster to edit.
It still requires that the author memorizes syntax symbols, but is streamlined and achievable for non-developers.


**Syntax Symbols Tailored to Old Cove.**
```
room key   #room key
location   %room key
alteration ~stateString

path       *prompt
move       >room key

alter      @stateString
limit      <number
needs      $itemKey
takes      -itemKey
gives      +itemKey

ignored    \#text
comment    //text
empty      empty
```