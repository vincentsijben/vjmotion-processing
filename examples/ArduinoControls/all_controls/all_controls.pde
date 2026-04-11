/**
 * all controls
 * a demo sketch for testing 3 pushbuttons, 3 potentiometers and 3 LED's.
 * https://github.com/vincentsijben/vjmotion-processing
 *
 * This example requires a connected Arduino board with:
 * 3 pushbuttons at digital ports 5,6 and 7
 * 3 potentiometers at ports A0, A1, A2
 * 3 LEDs at digital ports 9, 10 and 11
 *
 */

import nl.genart.VJMotion.arduinocontrols.*;
import processing.serial.*;
import cc.arduino.*;

Arduino arduino;
ArduinoControls ac;

void setup() {
  size(900, 500);

  //println(Arduino.list());
  //arduino = new Arduino(this, Arduino.list()[2], 57600);
  //arduino.pinMode(5, Arduino.INPUT_PULLUP);
  //arduino.pinMode(6, Arduino.INPUT_PULLUP);
  //arduino.pinMode(7, Arduino.INPUT_PULLUP);
  //arduino.pinMode(9, Arduino.OUTPUT);
  //arduino.pinMode(10, Arduino.OUTPUT);
  //arduino.pinMode(11, Arduino.OUTPUT);

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
    .showInfoPanel()
    .setInfoPanelKey('i')
    ;

  // delay the start of the draw loop so the Arduino is in the ready state
  // because the first few frames, digitalRead returned incorrect values
  delay(2000);

  textAlign(CENTER, CENTER);
  textSize(50);
  stroke(255);
  strokeWeight(3);
}

void draw() {
  background(50);

  // use the potentiometers normalized values to control each LED brightness
  ac.setLED(0, int(lerp(0, 255, ac.getPotentiometer(0))));
  ac.setLED(1, int(lerp(0, 255, ac.getPotentiometer(1))));
  ac.setLED(2, int(lerp(0, 255, ac.getPotentiometer(2))));

  noFill();
  if (ac.getPushButton(0)) fill(255, 0, 0);
  if (ac.getPushButton(1)) fill(0, 255, 0);
  if (ac.getPushButton(2)) fill(0, 0, 255);

  circle(lerp(0, width, ac.getPotentiometer(0)), height/4*1, 100);
  circle(lerp(0, width, ac.getPotentiometer(1)), height/4*2, 100);
  circle(lerp(0, width, ac.getPotentiometer(2)), height/4*3, 100);

  fill(255);
  text("A0", lerp(0, width, ac.getPotentiometer(0)), height/4*1);
  text("A1", lerp(0, width, ac.getPotentiometer(1)), height/4*2);
  text("A2", lerp(0, width, ac.getPotentiometer(2)), height/4*3);
}
