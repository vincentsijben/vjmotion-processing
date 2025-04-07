// Import the library to your sketch
import nl.genart.VJMotion.frequencyanalyzer.*;

// Import the minim library
import ddf.minim.*;
import ddf.minim.analysis.*;

Minim minim;
FrequencyAnalyzer fa;

void setup() {
  size(500, 500);
  minim = new Minim(this);

  fa = new FrequencyAnalyzer(this)
    .addMinim(minim)
    .setFile("https://github.com/vincentsijben/vjmotion-processing/raw/main/assets/infraction_music_-_ritmo.mp3")
    .setAudioInputMode(AudioInputMode.AUDIO_FILE)
    ;
}


void draw() {
  background(0); // Clear the screen with a black background
  noFill();

  stroke(255);
  for (int i = 0; i < 30; i++) {
    float x = map(i, 0, 30, 0, width);
    float y = map(fa.getVolume(i), 0, 1, height, height/2);
    
    line(x, height, x, y);
  }

  fill(0, 200, 0);
  circle(width/4*1, height/2, fa.getVolume(0)*100);
  circle(width/4*2, height/2, fa.getVolume(10)*100);
  circle(width/4*3, height/2, fa.getVolume(20)*100);
  circle(width/4*2, height/4*3, fa.getVolume()*100);
}
