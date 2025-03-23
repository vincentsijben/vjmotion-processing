# Getting Started
Thank you for trying or using this library! It's easy to set up and use. Just follow the instructions.

## Setting up the library
Install the library by downloading the latest release through the Processing contribution manager. Open Processing and go to Sketch > Import Library... > Manage Libraries... , search for VJMotion and click install.

## Usage
```
import nl.genart.VJMotion.beatsperminute.*;
BeatsPerMinute bpm;

void setup() {
  size(500, 500);
  bpm = new BeatsPerMinute(this);
  bpm.setBPM(30);
}

void draw() {
  background(50);
  circle(width/2, height/2, bpm.easeBounce()*500);
}
```