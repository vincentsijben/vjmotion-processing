import nl.genart.VJMotion.beatsperminute.*;
import nl.genart.VJMotion.frequencyanalyzer.*;
import nl.genart.VJMotion.arduinocontrols.*;
import ddf.minim.*;
import ddf.minim.analysis.*;
import processing.serial.*;
import cc.arduino.*;

Arduino arduino;
ArduinoControls ac;
BeatsPerMinute bpm;
Minim minim;
FrequencyAnalyzer fa;
int currentScene = 1;

void VJ_Motion_setup() {
  //arduino = new Arduino(this, Arduino.list()[2], 57600);
  //arduino.pinMode(5, Arduino.INPUT_PULLUP);
  //arduino.pinMode(6, Arduino.INPUT_PULLUP);
  //arduino.pinMode(7, Arduino.INPUT_PULLUP);
  //arduino.pinMode(9, Arduino.OUTPUT);
  //arduino.pinMode(10, Arduino.OUTPUT);
  //arduino.pinMode(11, Arduino.OUTPUT);
  minim = new Minim(this);

  ac = new ArduinoControls(this)
    .addArduino(arduino)
    .addLED(9, LEDMode.PWM)
    .addLED(10, LEDMode.PWM)
    .addLED(11, LEDMode.PWM)
    .addPushButton(5, '1', Arduino.LOW)
    .addPushButton(6, '2', Arduino.LOW)
    .addPushButton(7, '3', Arduino.LOW)
    .addPotentiometer(0, 'q')
    .addPotentiometer(1, 'w')
    .addPotentiometer(2, 'e')
    //.setInfoPanelKey('i')
    ;
  bpm = new BeatsPerMinute(this)
    .setBPM(60)
    //.setInfoPanelKey('o')
    ;
  fa = new FrequencyAnalyzer(this)
    .addMinim(minim)
    .setAudioInputMode(AudioInputMode.LINE_IN)
    //.setFile("https://github.com/vincentsijben/vjmotion-processing/raw/main/assets/infraction_music_-_ritmo.mp3")
    //.setAudioInputMode(AudioInputMode.AUDIO_FILE)
    //.setInfoPanelKey('p')
    ;

  // hide the mouse cursor
  noCursor();

  // delay the start of the draw loop so the Arduino is in the ready state
  // because the first few frames, digitalRead returned incorrect values
  delay(2000);
}

void VJ_Motion_draw() {
  if (currentScene == 1) {
    showScene1();
  }
  if (currentScene == 2) {
    showScene2();
  }
  if (currentScene == 3) {
    showScene3();
  }

  //when the push button is pressed, change the scene (1,2,3)
  if (ac.getPushButtonOnce(0)) currentScene = (currentScene % 3) + 1;
}
