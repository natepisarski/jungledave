# Jungle Dave
These are dark times. The major forces of North America are mobilizing for war. Mexico is going for broke, dominating everything in its path! As Canada, you must use your cunning, allies, (and moose) to push Mexico back!

# How to Play
You can move Canada with W, A, S, D. As you're moving, 'p' will unleash the might of America against your foes, following you into the breech.

The object of the game is to collect as many nukes as possible to shut Mexico down. Every second nuke you collect will launch an ICBM! Hit Mexico with the ICBM to send it flying, or hit another nuke with it and watch the nuclear fallout.

# Code
The code itself is written in Typescript and compiled down to Javascript, which is linked to a Microsoft MVC 4 View. The Controller code, although minimal, is written in C#.

## Code Explanation
Anything in the code that can move is a MovableItem. Canada, America, Nuke, ShotNuke (ICBM), all implement MovableItem to customize their movement around the website.

Javascript timers are used to

* Clear large Fallout's every 5000ms, as well as checking if the user is out of bounds
* Check for collisions every 25ms

# License
BSD 3-clause
