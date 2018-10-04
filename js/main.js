var keyWidth = 20;
var keyHeight = 80;

var midi, data;
// request MIDI access
if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess({
        sysex: false
    }).then(onMIDISuccess, onMIDIFailure);
} else {
    alert("No MIDI support in your browser.");
}

// midi functions
function onMIDISuccess(midiAccess) {
    // when we get a succesful response, run this code
    midi = midiAccess; // this is our raw MIDI data, inputs, outputs, and sysex status

    var inputs = midi.inputs.values();
    // loop over all available inputs and listen for any MIDI input
    for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
        // each time there is a midi message call the onMIDIMessage function
        input.value.onmidimessage = onMIDIMessage;
    }
}

function onMIDIFailure(error) {
    // when we get a failed response, run this code
    console.log("No access to MIDI devices or your browser doesn't support WebMIDI API. Please use WebMIDIAPIShim " + error);
}

function onMIDIMessage(event) {
    data = event.data,
    cmd = data[0] >> 4,
    channel = data[0] & 0xf,
    type = data[0] & 0xf0, // channel agnostic message type. Thanks, Phil Burk.
    note = data[1],
    velocity = data[2];
    // with pressure and tilt off
    // note off: 128, cmd: 8 
    // note on: 144, cmd: 9
    // pressure / tilt on
    // pressure: 176, cmd 11: 
    // bend: 224, cmd: 14

    switch (type) {
        case 144: // noteOn message 
             noteOn(note, velocity);
             break;
        case 128: // noteOff message 
            noteOff(note, velocity);
            break;
        case 176:
            padel();
            break;
    }

    //console.log('data', data, 'cmd', cmd, 'channel', channel);
}

var padelPressed = false;
function padel() {
    padelPressed = !padelPressed;
    console.log(padelPressed)
    
}

function noteOn(midiNote, velocity) {
    pressedButtons[midiNote-21] = velocity;
    redrawCanvas();
}

function noteOff(midiNote, velocity) {
    pressedButtons[midiNote-21] = null;
    redrawCanvas();
}

var pressedButtons = {};
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

function redrawCanvas() {
    ctx.canvas.width = ctx.canvas.width;
    
    // MODs
    // 0 == A
    // 1 == Bb
    // 2 == B
    // 3 == C
    // 4 == Db
    // 5 == D
    // 6 == Eb
    // 7 == E
    // 8 == F
    // 9 == Gb
    // 10 == G
    // 11 == Ab
    
    var drawnPos = {};

    for(var i in pressedButtons) {
        var velocity = pressedButtons[i];
        
        if(velocity) {
            var keyPosition = getKeyPosition(i, true);
            var x = keyPosition[0];
            var isHalfStep = keyPosition[1];
            if(isHalfStep) { //Half steps
                var diff = 6;
                if(i%12==6 || i%12==1) {
                    diff = 5;
                } else if(i%12==1) {
                    diff = 4;
                }
                x = x+(keyWidth*diff);
                // ctx.fillStyle = "#FF0000";
                // ctx.fillRect(x+keyWidth/4,0,keyWidth/2,keyHeight-10);
                drawnPos[x+keyWidth/4] = true;
            } else {
                x = x+(keyWidth*5);
                ctx.fillStyle = "#FF0000";
                ctx.fillRect(x,0,keyWidth,keyHeight);
            }
        }
    }

    for(var j=0;j<=100;j++) {
        var keyPosition = getKeyPosition(j);
        var x = keyPosition[0];
        //console.log(j, x)
        var isHalfStep = keyPosition[1];

        if(!isHalfStep) {
            ctx.fillStyle = "#000000";
            ctx.strokeRect(x,0,keyWidth,keyHeight);
        }
    }

    for(var j=0;j<=100;j++) {
        var keyPosition = getKeyPosition(j);
        var x = keyPosition[0];
        //console.log(j, x)
        var isHalfStep = keyPosition[1];

        if(isHalfStep) {
            if(drawnPos[x+keyWidth/4]) {
                ctx.fillStyle = "#FF0000";
                ctx.fillRect(x+keyWidth/4,0,keyWidth/2,keyHeight-10);
                ctx.fillStyle = "#000000";
                ctx.lineWidth=2;
                ctx.strokeRect(x+keyWidth/4,0,keyWidth/2,keyHeight-10);
            } else {
                ctx.fillStyle = "#000000";
                ctx.fillRect(x+keyWidth/4,0,keyWidth/2,keyHeight-10);
            }
            

            
            
        }
    }
}
redrawCanvas();

function getKeyPosition(i, log) {
    var i = parseInt(i);
    var octave = Math.floor((i)/12);
    var key = false;
    var ret = [];
    if(i%12==1 || i%12==4 || i%12==6 || i%12==9 || i%12==11) { //half Steps
        key = i%12==1 && !key ? 1 : key;
        key = i%12==4 && !key ? 2 : key;
        key = i%12==6 && !key ? 4 : key;
        key = i%12==9 && !key ? 5 : key;
        key = i%12==11 && !key ? 6 : key;
        key--;
        var offset = keyWidth/2;
        ret = [(octave*7)*keyWidth+key*keyWidth+offset, true]
    } else {
        //var i = parseInt(i)+8; //Begin with A
        key = i%12==0 && !key ? 1 : key;
        key = i%12==2 && !key ? 2 : key;
        key = i%12==3 && !key ? 3 : key;
        key = i%12==5 && !key ? 4 : key;
        key = i%12==7 && !key ? 5 : key;
        key = i%12==8 && !key ? 6 : key;
        key = i%12==10 && !key ? 7 : key;
        key--;
        if(log) console.log(octave, key)
        ret = [(octave*7)*keyWidth+key*keyWidth, false];
        
    }
    return ret;
}