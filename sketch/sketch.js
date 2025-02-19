let recordingNumber = 0;

let canvas;
let state = 1; // 0 for guest/new user, 1 for logged in person with customized keymaps, 2 for keyboard key reassignment, 3 for recording
let originalState = 1;
let currentUser;
let keyArray = [];

let recording = {};
let startTime = 0;

let url = "https://nguyenshana.github.io/piano-sounds/"

let soundFiles = [
  url + "c0.mp3",
  url + "c0s.mp3",
  url + "d0.mp3",
  url + "d0s.mp3",
  url + "e0.mp3",
  url + "f0.mp3",
  url + "f0s.mp3",
  url + "g0.mp3",
  url + "g0s.mp3",
  url + "a0.mp3",
  url + "a0s.mp3",
  url + "b0.mp3",

  url + "c1.mp3",
  url + "c1s.mp3",
  url + "d1.mp3",
  url + "d1s.mp3",
  url + "e1.mp3",
  url + "f1.mp3",
  url + "f1s.mp3",
  url + "g1.mp3",
  url + "g1s.mp3",
  url + "a1.mp3",
  url + "a1s.mp3",
  url + "b1.mp3",

  url + "c2.mp3",
  url + "c2s.mp3",
  url + "d2.mp3",
  url + "d2s.mp3",
  url + "e2.mp3",
  url + "f2.mp3",
  url + "f2s.mp3",
  url + "g2.mp3",
  url + "g2s.mp3",
  url + "a2.mp3",
  url + "a2s.mp3",
  url + "b2.mp3",
  url + "c3.mp3"
]

let defaultKeyMapping = {
  "c0" : ["white", "1", soundFiles[0], 20],
  "c0#" : ["black", "2", soundFiles[1], 40],
  "d0" : ["white", "3", soundFiles[2], 50],
  "d0#" : ["black", "4", soundFiles[3], 70],
  "e0" : ["white", "5", soundFiles[4], 80],

  "f0" : ["white", "6", soundFiles[5], 110],
  "f0#" : ["black", "7", soundFiles[6], 130],
  "g0" : ["white", "8", soundFiles[7], 140],
  "g0#" : ["black", "9", soundFiles[8], 160],
  "a0" : ["white", "0", soundFiles[9], 170],
  "a0#" :["black", "-", soundFiles[10], 190],
  "b0" : ["white", "=", soundFiles[11], 200],


  "c1" : ["white", "a", soundFiles[12], 230],
  "c1#" : ["black", "s", soundFiles[13], 250],
  "d1" : ["white", "d", soundFiles[14], 260],
  "d1#" : ["black", "f", soundFiles[15], 280],
  "e1" : ["white", "g", soundFiles[16], 290],

  "f1" : ["white", "h", soundFiles[17], 320],
  "f1#" : ["black", "j", soundFiles[18], 340],
  "g1" : ["white", "k", soundFiles[19], 350],
  "g1#" : ["black", "l", soundFiles[20], 370],
  "a1" : ["white", ";", soundFiles[21], 380],
  "a1#" :["black", "'", soundFiles[22], 400],
  "b1" : ["white", "/", soundFiles[23], 410],


  "c2" : ["white", "q", soundFiles[24], 440],
  "c2#" : ["black", "w", soundFiles[25], 460],
  "d2" : ["white", "e", soundFiles[26], 470],
  "d2#" : ["black", "r", soundFiles[27], 490],
  "e2" : ["white", "t", soundFiles[28], 500],

  "f2" : ["white", "y", soundFiles[29], 530],
  "f2#" : ["black", "u", soundFiles[30], 550],
  "g2" : ["white", "i", soundFiles[31], 560],
  "g2#" : ["black", "o", soundFiles[32], 580],
  "a2" : ["white", "p", soundFiles[33], 590],
  "a2#" :["black", "[", soundFiles[34], 610],
  "b2" : ["white", "]", soundFiles[35], 620]
}

// end main variables


function setup() 
{
  noLoop();
  strokeWeight(4);

  if(state === 0) 
  {
    let addKeyIndex = 0;
    for(let note in defaultKeyMapping) 
    {
      if(defaultKeyMapping[note][0] === "white")
      {
        keyArray[addKeyIndex] = new WhiteKey(note, defaultKeyMapping[note][1], defaultKeyMapping[note][2], defaultKeyMapping[note][3]);
      }
      else 
      {
        keyArray[addKeyIndex] = new BlackKey(note, defaultKeyMapping[note][1], defaultKeyMapping[note][2], defaultKeyMapping[note][3]);
      }
      addKeyIndex += 1;
    }

    currentUser = new User(keyArray);
  }
  // if signed in: set state = 1 & get their key array
  else if(state === 1) 
  {
    let addKeyIndex = 0;
    for(let note in defaultKeyMapping) 
    {
      if(defaultKeyMapping[note][0] === "white")
      {
        keyArray[addKeyIndex] = new WhiteKey(note, defaultKeyMapping[note][1], defaultKeyMapping[note][2], defaultKeyMapping[note][3]);
      }
      else 
      {
        keyArray[addKeyIndex] = new BlackKey(note, defaultKeyMapping[note][1], defaultKeyMapping[note][2], defaultKeyMapping[note][3]);
      }
      addKeyIndex += 1;
    }

    currentUser = new User(keyArray);
  }
}

  /* if just creating a sketch to play recordings, don't draw anything
  else if (state === 4) {
    currentUser = new User(keyArray)
    FOR EACH ITEM IN RECORDING ARRAY, CALL USER. ADD RECORDING
  }
  */


// currently drawing keys in order from left to right
function draw()
{

  fill(0);
  if (state < 4) 
  {
    canvas = createCanvas(windowWidth, windowHeight);
  }
  if(state === 0) // new user or guest (if first time logged in, automatically set their keymapps to default; this needs to be toggled in React)
  {

    // draws keys
    for(let i = 0; i < keyArray.length; i++) 
    {
      keyArray[i].drawKey();
    }
    drawMapButton();

  } 
  else if (state === 1) // someone is logged in; basically same as 0
  {
    // draws keys
    for(let j = 0; j < keyArray.length; j++) 
    {
      keyArray[j].drawKey();
    }
    drawMapButton();

    drawRecordButton();

  }
  else if (state === 2) // changing keystrokes
  {
    // draws keys
    for(let k = 0; k < keyArray.length; k++) 
    {
      keyArray[k].drawKey();
    }
    drawPlayButton();

  }
  else if (state === 3) // recording
  {
    // draws keys
    for(let l = 0; l < keyArray.length; l++) 
    {
      keyArray[l].drawKey();
    }

    drawEndRecordingButton();

  }
  else if (state === 4) // just playing recording, not display piano
  {
    createCanvas(0, 0);
  }

} // end draw()


function windowResized() 
{
  redraw();
}



/* MAPPING BUTTON SECTION */

let buttonX = 300;
let buttonY = 200;
let buttonWidth = 180;
let buttonHeight = 30;

/**
Draws button to display for user to change to map mode
*/
function drawMapButton() 
{
  fill(0);
  rect(buttonX, buttonY, buttonWidth, buttonHeight);
  fill(255);
  text('Click here to change mappings', buttonX + 7, buttonY + 20);
}


/**
Draws button to display for user to change to regular mode
*/
function drawPlayButton() 
{
  fill(255);
  rect(buttonX, buttonY, buttonWidth, buttonHeight);
  fill(0);
  text('Click here to play piano', buttonX + 25, buttonY + 20);
}


/* RECORDING BUTTON SECTION */

let rbuttonX = 150;
let rbuttonY = 200;
let rbuttonWidth = 100;
let rbuttonHeight = 30;

/**
Draws button to display for user to change to map mode
*/
function drawRecordButton() 
{
  fill(0);
  rect(rbuttonX, rbuttonY, rbuttonWidth, rbuttonHeight);
  fill(255);
  text('Record', rbuttonX + 30, rbuttonY + 20);
}


/**
Draws button to display for user to change to regular mode
*/
function drawEndRecordingButton() 
{
  fill(255);
  rect(rbuttonX, rbuttonY, rbuttonWidth, rbuttonHeight);
  fill(0);
  text('End Recording', rbuttonX + 10, rbuttonY + 20);
}




/* USER INPUT SECTION (keyboard key press or mouse click) */

let currentSelectedKey = null;
let textX = 30;
let textY = 200;

/**
Function is called when a keyboard key is pressed
*/
function keyPressed()
{
	redraw();
	fill(0);
	if(state === 0 || state === 1 || state === 3) {
		text(`Key pressed: ${key}`, textX, textY);
		// 
		// loop through ALL of list to find corresponding key(s) & then play the audio
		//
		for(let m = 0; m < keyArray.length; m++) {
		  if(keyArray[m].getKeyboardKey() === key) {
		    keyArray[m].drawPressedKey();
		  }
		}
	}
	else if (state === 2) { // change the keymapping and notify user
	// text(`Key pressed: ${key} (no piano key selected to remap)`, textX, textY);

		if(currentSelectedKey != null) 
		{
		  let sameKeyIndex = 0;
		  while(sameKeyIndex < keyArray.length) 
		  {
		    if(keyArray[sameKeyIndex] === currentSelectedKey) 
		    {
		      break;
		    }
		    sameKeyIndex += 1;
		  }
		  keyArray[sameKeyIndex].changeKeyboardKey();
		  currentSelectedKey = null;
		}
	}
	if (state === 3) { // recording
		for(let n = 0; n < keyArray.length; n++) {
		  if(keyArray[n].getKeyboardKey() === key) {
		    recording[millis() - startTime] = keyArray[n];
		  }
		}
	}	

} // end keyPressed()


function keyReleased() {
  redraw();
}


/**
Function is called when mouse left button is pressed
*/
function mouseClicked()
{
	// Remaping button is pressed
	if(mouseX > buttonX && mouseX < buttonX + buttonWidth && mouseY > buttonY && mouseY < buttonY + buttonHeight) 
	{
	  if(state === 2) 
	  {
	    if(originalState === 1) 
	    {
	      state = 1;
	    }
	    else 
	    {
	      state = 0;
	    }
	    currentUser.updateKeyMappings(keyArray);
	    redraw();
	  }
	  else if (state === 0 || state === 1) 
	  {
	    state = 2;
	    redraw();
	  } 
	} 
	else if(state === 2) 
	{ // see if user if selecting a key to remap
	  currentSelectedKey = selectKeyToRemap();
	}
	// Recording button
	if(mouseX > rbuttonX && mouseX < rbuttonX + rbuttonWidth && mouseY > rbuttonY && mouseY < rbuttonY + rbuttonHeight && originalState === 1) 
	{
	  if(state === 0 || state === 1) 
	  { // starting recording
	    state = 3;
	    recording = {};
	    startTime = millis();
	  }
	  else if(state === 3) 
	  { // ending recording
	    state = 1;
	    currentUser.addRecording();
	  }
	  redraw();
	}

	// display recordings below the piano
	let recordingsArray = currentUser.getRecordings();
	fill(0);
	for(let nn = 0; nn < recordingsArray.length; nn++) 
	{
	  let index = textY + 90;
	  text(`Recording #${nn + 1}`, textX + (nn * 200), index - 30);
	  let keys = Object.keys(recordingsArray[nn]);
	  keys.forEach(key=>{
	    let note = recordingsArray[nn][key].getNote();
	    text(`${key}ms --> ${note}`, textX + (nn * 200), index);
	    index += 20;
	  });
	}

} // end mouseClicked()


/**
Finds which piano key is clicked on and returns it
*/
function selectKeyToRemap() {

  redraw();
  let whiteKeys = [];
  let selectedBlackKey = false;
  let selectedKey = null;

  // iterate through black keys first because they're visually "on top"
  let findKeyIndex = 0;
  while(findKeyIndex < keyArray.length) 
  {
    if(keyArray[findKeyIndex].constructor.name === "BlackKey") 
    {
      if(keyArray[findKeyIndex].contains(mouseX, mouseY)) 
      {
        selectedKey = keyArray[findKeyIndex];
        findKeyIndex = keyArray.length;
        selectedBlackKey = true;
      }
    }
    else 
    {
      whiteKeys.push(keyArray[findKeyIndex]);
    }
    findKeyIndex += 1;
  }
  // if black key wasn't selected, then iterate through white keys
  if(!selectedBlackKey) 
  {
    findKeyIndex = 0;
    while(findKeyIndex < whiteKeys.length) 
    {
      if(whiteKeys[findKeyIndex].contains(mouseX, mouseY)) 
      {
        selectedKey = whiteKeys[findKeyIndex];
        findKeyIndex = whiteKeys.length;
      }

      findKeyIndex += 1;
    }
  }

  fill(0);
  if(selectedKey == null) {
    text("Please press on a piano key! :)", textX, textY);
  } else {
    text(`Press on new keyboard key to map with ${selectedKey.getNote()}`, textX, textY);
  }

  return selectedKey;

}

// end of main functions



/**
Abstract class to hold Piano Key note name, sound file, and top-left Y position
(tbh not sure if abstract is the correct term, but don't initialize this)
*/
class PianoKey 
{
  constructor(note, keyboardKey, sound) 
  {
    this.note = note;
    this.keyboardKey = keyboardKey;
    this.sound = loadSound(sound);
    this.startY = 20;
  }

  play() {
    this.sound.play();
  }

  contains(x, y) 
  {
    if(x > this.startX && x < this.startX + this.width && y > this.startY && y < this.startY + this.height) 
    {
      return true;
    }
    return false;
  }

  changeKeyboardKey() {
    this.keyboardKey = key;
    redraw();
    text(`New key = ${key} for ${this.note}`, textX, textY);
  }

  getNote() {
    return this.note;
  }

  getKeyboardKey() {
    return this.keyboardKey;
  }

}


/**
White piano key class
*/
class WhiteKey extends PianoKey
{
  // assume they all start at the same Y position
  constructor(note, keyboardKey, sound, startX) {
    super(note, keyboardKey, sound);
    this.startX = startX;
    this.width = 30;
    this.height = 140;
    this.drawWhiteKey();
  }

  drawKey() {
    this.drawWhiteKey();
  }

  // 75 because that's the height of a black key
  drawPressedKey() {
    strokeWeight(0);
    fill(200)
    rect(this.startX, this.startY + 75, this.width, this.height - 75);
    strokeWeight(1);
    fill(0);
    text(this.keyboardKey, this.startX + this.width/2 , this.startY + this.height - 5);
    super.play();
  }

  drawWhiteKey() {
    noFill();
    rect(this.startX, this.startY, this.width, this.height);
    fill(0);
    text(this.keyboardKey, this.startX + this.width/2 , this.startY + this.height - 5);
  }


} // end WhiteKey



/**
Black piano key class
*/
class BlackKey extends PianoKey
{
  // assume they all start at the same Y position
  constructor(note, keyboardKey, sound, startX) {
    super(note, keyboardKey, sound);
    this.startX = startX;
    this.width = 20;
    this.height = 75;
    this.drawBlackKey();
  }

  drawKey() {
    this.drawBlackKey();
  }

  drawPressedKey() {
    fill(100);
    rect(this.startX + 1, this.startY, this.width - 2, this.height - 1);
    fill(255);
    text(this.keyboardKey, this.startX + this.width/2 , this.startY + this.height - 5);
    super.play()
  }

  drawBlackKey() {
    fill(0);
    rect(this.startX, this.startY, this.width, this.height);
    fill(255);
    text(this.keyboardKey, this.startX + this.width/2 , this.startY + this.height - 5);
  }

} // end BlackKey



/**
Class to represent a user & their keyboard mappings
*/
class User 
{
  // keys input is an array of PianoKeys, both WhiteKey and BlackKey
  constructor(keys) {
    this.allKeys = keys;
    // format for recordings [{},{}]
    // recording = {timeInMillisec, PianoKey}
    this.recordings = [];
  }

  updateKeyMappings(keys) {
    this.allKeys = keys;
  } 

  // this resets the keyArray accessible throughout the entire file to the default mapping as well
  revertToDefaultMapping() 
  {
    let addKeyIndex = 0;
    for(let note in defaultKeyMapping) 
    {
      if(defaultKeyMapping[note][0] === "white")
      {
        keyArray[addKeyIndex] = new WhiteKey(note, defaultKeyMapping[note][1], defaultKeyMapping[note][2], defaultKeyMapping[note][3]);
      }
      else 
      {
        keyArray[addKeyIndex] = new BlackKey(note, defaultKeyMapping[note][1], defaultKeyMapping[note][2], defaultKeyMapping[note][3]);
      }
      addKeyIndex += 1;
    }
    this.allKeys = keyArray
  }

  getKeyMappings() {
    return this.allKeys;
  }

  // This method adds a recording to the p5 User object
  addRecording() {
    this.recordings.push(recording);
    fill(0);
  }

  getRecordings() {
    return this.recordings;
  }

  playRecording(recordingIndex) {
    var timeKeys = Object.keys(this.recordings[recordingIndex]);
    var iteratingRecording = this.recordings[recordingIndex];
    timeKeys.forEach(timeKeys=>{
      this.playRecordingHelper(iteratingRecording[timeKeys], timeKeys);
    });
  } 

  playRecordingHelper(note, waitTime) {
    setTimeout(function() {
        note.play();
      }.bind(this), waitTime);
  }

} // end User
