# Liminal - JS13K Compo Entry

**_Always Climbing, Never Sliding Down._**


## How to Build

Run ```build``` script to prepare and build the package:
```
./build
```

The included files and the final package stat is available in the output.


## How to Develop

Make sure you run ./reindex script to index and include all *.js scripts.

```./index.html``` is the base index file for the game.

```./termit.html``` includes the debug console used in development.


## Source Structure

The source is contained in the ```/mod``` folder.

It has the following structure:

```
/mod
  |
  |-/dev - development tools not included in the final package (*)
  |-/ext - external tools (*)
  |-/dry - the zap framework core and utilities
  |-/html - the final pacakge index.html
  |-/jet - common framework files
  |-/res - test resources folder (*)
  |-/sandbox - test stages
  |-/stage - the game logic and the default stage
```

```*``` *Marks folders not included in the final pacakge.*


## How to Test in Sandboxes

Each sandbox declares a custom stage initializer on the core zap object ```_```, e.g:

```
_.boxCube = function() {...}
```

The sandbox staging function is executed instead of the default stage
when ```#box...``` anchor is available in the URL.
It **MUST** match the box function name, e.g.:

```
...index.html#boxOne
```

Will call ```_.boxOne()``` staging function instead of the ```_.defaultStage()```

