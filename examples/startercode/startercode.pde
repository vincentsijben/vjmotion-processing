/**
 * Project: [Your project title]
 * Author: [Your full name]
 * Vimeo URL: [Your vimeo share link]
 * 
 * Description: [summarize your work in a few lines]
 * Controls: [list all the controls of this work and what they do (keypresses, mousepresses, Arduino push buttons, potentiometers etc)]
 * Source materials: [list all the sources you've used and explain your enhancements]
 **/
 
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

void setup() {

  size(900, 500);

  arduino = new Arduino(this, Arduino.list()[2], 57600);
  arduino.pinMode(5, Arduino.INPUT_PULLUP);
  arduino.pinMode(6, Arduino.INPUT_PULLUP);
  arduino.pinMode(7, Arduino.INPUT_PULLUP);
  arduino.pinMode(9, Arduino.OUTPUT);
  arduino.pinMode(10, Arduino.OUTPUT);
  arduino.pinMode(11, Arduino.OUTPUT);
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
    .setInfoPanelKey('i')
    ;
  bpm = new BeatsPerMinute(this)
    .setBPM(60)
    .setInfoPanelKey('o')
    ;
  fa = new FrequencyAnalyzer(this)
    .addMinim(minim)
    .setAudioInputMode(AudioInputMode.LINE_IN)
    .setInfoPanelKey('p')
    ;

  // delay the start of the draw loop so the Arduino is in the ready state
  // because the first few frames, digitalRead returned incorrect values
  delay(2000);
}

void draw() {
  background(50);

  
}
