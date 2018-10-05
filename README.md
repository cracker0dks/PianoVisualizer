# PianoVisualizer

Visualize MIDI Input as Firework

Video:


[![preview](https://img.youtube.com/vi/D4jRT7jpACQ/0.jpg)](https://youtu.be/D4jRT7jpACQ)

## Setup
1. Download or clone
2. Open index.html (Chrome)
3. Open Console (F12) and search your input device (Digital Piano at this example)
````
INPUTS - Type: useMidiIn(id)
ID: input-0 Name:Digital Piano
ID: input-1 Name:loopMIDI Port
````
4. Type in console: useMidiIn(id)! (Replace id with your device Id. In this example: useMidiIn("input-0")

Done!

## Tips
* You can use more than one Input device
* You can pipe the input to an output device to use the midi on a second software
  * Install LoopMIDI
  * Refresh browser and passThroughMidiOut(id) with the correct ID

