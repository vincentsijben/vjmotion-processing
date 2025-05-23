/*
  This ArduinoControls class is used at the Institute of Arts Maastricht exposition, semester Generative Art
 Students build their own Arduino remote controller with 3 potentiometers and 3 pushbuttons.
 This library simplifies the use for these controls. It adds functionality like:
 - executing single commands when longpressing getPushButtonOnce(0);
 - multiple pushbuttons being pressed if (getPushButton(0) && getPushButton(1))
 - smooth analog potmeter values getPotmeter(0,0.02); reducing jumping values
 - fallback to keyboard and mouse when not using arduino. e.g. 1 to 9 for pushbuttons. q,w,e,r,t,y together with mouseX for potmeters
 - adjustable infopanel (set hotkey, y position)
 - Only write LED once, not continuously, preventing flickering
 */

package nl.genart.VJMotion.arduinocontrols;

import cc.arduino.*;
import java.util.ArrayList;
import nl.genart.VJMotion.InfoPanel;
import processing.core.PApplet;
import processing.core.PConstants;
import processing.core.PGraphics;
import processing.event.KeyEvent;

public class ArduinoControls {

  private PApplet parent;
  private Arduino arduino;
  private InfoPanel infoPanel;

  private boolean enableKeyPress;
  private ArrayList<PushButton> pushbuttons;
  private ArrayList<Potentiometer> potentiometers;
  private ArrayList<LDR> ldrs;
  private ArrayList<LED> leds;
  private int lastFrameCount;
  

  public ArduinoControls(PApplet parent) {
    this.parent = parent;
    this.pushbuttons = new ArrayList<PushButton>();
    this.potentiometers = new ArrayList<Potentiometer>();
    this.ldrs = new ArrayList<LDR>();
    this.leds = new ArrayList<LED>();
    this.infoPanel = new InfoPanel(parent);
    this.enableKeyPress = true;
    this.lastFrameCount = -1;

    // https://github.com/benfry/processing4/wiki/Library-Basics
    parent.registerMethod("draw", this);
    parent.registerMethod("pre", this);
    parent.registerMethod("post", this);
    parent.registerMethod("keyEvent", this);
  }

  public ArduinoControls addArduino(Arduino arduino) {
    this.arduino = arduino;
    if (this.arduino != null) this.enableKeyPress = false;
    return this;
  }

  //////////////////////////////////////////////////////////////
  // LED
  //////////////////////////////////////////////////////////////
  public ArduinoControls addLED(int pinNumber) {
    return this.addLED(pinNumber, LEDMode.DIGITAL);
  }

  public ArduinoControls addLED(int pinNumber, LEDMode mode) {
    LED newLED = new LED(pinNumber, mode);
    this.leds.add(newLED);
    return this;
  }

  public void setLEDToOn(int index) {
    if (index >= 0 && index < this.leds.size()) {
      LED led = this.leds.get(index);

      if (led.mode == LEDMode.PWM)
        this.setLED(index, 255);
      else
        this.setLED(index, Arduino.HIGH);
    } else {
      System.out.println("warning: index " + index
          + " was used which is out of bounds for the ArrayList leds with size " + leds.size());
    }
  }

  public void setLEDToOff(int index) {
    this.setLED(index, Arduino.LOW);
  }

  public void setLED(int index, int value) {
    if (index >= 0 && index < this.leds.size()) {
      LED led = this.leds.get(index);
      if (value != led.value) { // no need to continuously write the same value, causes flickering on pwm
        led.value = value;
        if (this.arduino != null) {

          if (led.mode == LEDMode.PWM)
            this.arduino.analogWrite(led.digitalPort, value);
          else {
            this.arduino.digitalWrite(led.digitalPort, value);
          }
        }
      }
    } else {
      System.out.println("warning: index " + index
          + " was used which is out of bounds for the ArrayList leds with size " + leds.size());
    }
  }

  //////////////////////////////////////////////////////////////
  // PUSHBUTTON
  //////////////////////////////////////////////////////////////
  public ArduinoControls addPushButton(int pinNumber, char keyboardKey, int signalPressed) {
    PushButton newPushButton = new PushButton(pinNumber, keyboardKey, signalPressed);
    this.pushbuttons.add(newPushButton);
    return this;
  }

  public boolean getPushButtonOnce(int index) {
    return this.getPushButton(index, true);
  }

  public boolean getPushButton(int index) {
    return this.getPushButton(index, false);
  }

  private boolean getPushButton(int index, boolean once) {
    if (index >= 0 && index < this.pushbuttons.size()) {
      PushButton pushbutton = this.pushbuttons.get(index);
      if (this.arduino != null) {
        if (this.arduino.digitalRead(pushbutton.digitalPort) == pushbutton.signalPressed
            && pushbutton.actionTaken == false) {
          pushbutton.actionTaken = true;
          pushbutton.pressed = true;
          pushbutton.pressedOnce = true;
          this.lastFrameCount = this.parent.frameCount;
        }
        if (this.arduino.digitalRead(pushbutton.digitalPort) != pushbutton.signalPressed) {
          pushbutton.actionTaken = false;
          pushbutton.pressed = false;
        }
      }

      return once ? pushbutton.pressedOnce : pushbutton.pressed;
    } else {
      System.out.println(
          "warning: index " + index + " was used which is out of bounds for the ArrayList pushbuttons with size "
              + pushbuttons.size() + ", returning false");
      return false;
    }
  }

  //////////////////////////////////////////////////////////////
  // LDR sensor
  //////////////////////////////////////////////////////////////
  public ArduinoControls addLDR(int pinNumber, char keyboardKey, int minValue, int maxValue) {
    LDR newLDR = new LDR(pinNumber, keyboardKey, minValue, maxValue);
    this.ldrs.add(newLDR);
    return this;
  }
  public float getLDR(int index) {
    return this.getLDR(index, 1.0f);
  }

  public float getLDR(int index, float smoothness) {
    if (index >= 0 && index < this.ldrs.size()) {
      float returnValue = this.ldrs.get(index).value;
      if (this.arduino != null) {
        this.ldrs.get(index).value = this.arduino.analogRead(this.ldrs.get(index).analogPort);
        returnValue = this.ldrs.get(index).value;

        // if we don't handle the raw input seperately (when calling getLDR(index,
        // 1.0)), every additional call to getLDR removes the previous smoothness
        if (smoothness < 1.0) {
          this.ldrs.get(index).smoothValue = PApplet.lerp(this.ldrs.get(index).smoothValue,
              this.ldrs.get(index).value, smoothness);
          returnValue = this.ldrs.get(index).smoothValue;
        }
      }
      return PApplet.constrain(PApplet.map(returnValue, this.ldrs.get(index).minValue,
          this.ldrs.get(index).maxValue, 0, 1), 0, 1);
    } else {
      System.out
          .println("warning: index " + index + " was used which is out of bounds for the ArrayList ldrs with size "
              + ldrs.size() + ", returning 0.0");
      return 0.0f;
    }
  }

  //////////////////////////////////////////////////////////////
  // POTENTIOMETER
  //////////////////////////////////////////////////////////////
  public ArduinoControls addPotentiometer(int pinNumber, char keyboardKey) {
    return this.addPotentiometer(pinNumber, keyboardKey, 0, 1023);
  }

  public ArduinoControls addPotentiometer(int pinNumber, char keyboardKey, int minValue, int maxValue) {
    Potentiometer newPotentiometer = new Potentiometer(pinNumber, keyboardKey, minValue, maxValue);
    this.potentiometers.add(newPotentiometer);
    return this;
  }

  public float getPotentiometer(int index) {
    return this.getPotentiometer(index, 1.0f);
  }

  public float getPotentiometer(int index, float smoothness) {
    if (index >= 0 && index < this.potentiometers.size()) {
      float returnValue = this.potentiometers.get(index).value;
      if (this.arduino != null) {
        this.potentiometers.get(index).value = this.arduino.analogRead(this.potentiometers.get(index).analogPort);
        returnValue = this.potentiometers.get(index).value;

        // if we don't handle the raw input seperately (when calling getPotmeter(index,
        // 1.0)), every additional call to getPotmeter removes the previous smoothness
        if (smoothness < 1.0) {
          this.potentiometers.get(index).smoothValue = PApplet.lerp(this.potentiometers.get(index).smoothValue,
              this.potentiometers.get(index).value, smoothness);
          returnValue = this.potentiometers.get(index).smoothValue;
        }
      }
      return PApplet.constrain(PApplet.map(returnValue, this.potentiometers.get(index).minValue,
          this.potentiometers.get(index).maxValue, 0, 1), 0, 1);
    } else {
      System.out
          .println("warning: index " + index + " was used which is out of bounds for the ArrayList potmeters with size "
              + potentiometers.size() + ", returning 0.0");
      return 0.0f;
    }
  }

  //////////////////////////////////////////////////////////////
  // KEYBOARD + MOUSE
  //////////////////////////////////////////////////////////////
  public ArduinoControls disableKeyPress() {
    this.enableKeyPress = false;
    this.infoPanel.enableKeyPress = false;
    return this;
  }

  public void keyEvent(KeyEvent event) {
    if (this.enableKeyPress) {
      // Removed KeyEvent.TYPE because p2d or p3d don't register TYPE
      if (event.getAction() == KeyEvent.PRESS)
        this.onKeyPress(event);
      else if (event.getAction() == KeyEvent.RELEASE)
        this.onKeyRelease(event);
    }
  }

  private void onKeyPress(KeyEvent event) {
    // handle long press events, only works in default renderer, not in P2D or P3D
    // if in P2D or P3D mode, quick-tap the q,w or e button to get the correct
    // mouseX value
    for (int i = 0; i < this.potentiometers.size(); i++) {
      Potentiometer potmeter = this.potentiometers.get(i);
      if (event.getKey() == potmeter.keyboardKey)
        potmeter.value = PApplet.constrain(
            (int) PApplet.map(this.parent.mouseX, 0, this.parent.width, potmeter.minValue, potmeter.maxValue),
            potmeter.minValue, potmeter.maxValue);
    }

    for (int i = 0; i < this.pushbuttons.size(); i++) {
      PushButton pushbutton = this.pushbuttons.get(i);

      if (event.getKey() == pushbutton.keyboardKey && pushbutton.actionTaken == false) {
        pushbutton.actionTaken = true;
        pushbutton.pressed = true;
        pushbutton.pressedOnce = true;
        this.lastFrameCount = this.parent.frameCount;
      }
    }
  }

  private void onKeyRelease(KeyEvent event) {
    // Reset the flag when the key is released, allowing for the action to be taken
    // on the next key press
    for (PushButton button : pushbuttons) {
      if (button.keyboardKey == event.getKey()) {
        button.actionTaken = false;
        button.pressed = false;
      }
    }
  }

  //////////////////////////////////////////////////////////////
  // INFOPANEL
  //////////////////////////////////////////////////////////////
  public ArduinoControls showInfoPanel() {
    this.infoPanel.show = true;
    return this;
  }

  public ArduinoControls setInfoPanelY(int y) {
    this.infoPanel.y = y;
    return this;
  }

  public ArduinoControls setInfoPanelKey(char keyboardKey) {
    this.infoPanel.keyboardKey = keyboardKey;
    return this;
  }

  public void draw() {
    // make sure everything in the main sketch is wrapped inside pushMatrix and
    // popMatrix, so the infopanel is always shown top left, even in 3D mode
    // pushMatrix, pushStyle in registermethod pre()
    // popMatrix, popStyle in registermethod draw()
    this.parent.popMatrix();
    this.parent.popStyle();

    // workaround for long press in P3D
    if (this.enableKeyPress && this.parent.keyPressed) {
      this.onKeyPress(new KeyEvent(this.parent, 0, 0, 0, this.parent.key, this.parent.keyCode));
    }

    if (this.infoPanel.show) {
      this.parent.hint(PConstants.DISABLE_DEPTH_TEST);

      // put the parents imageMode temporarily to CORNER
      this.parent.pushStyle();
      this.parent.imageMode(PConstants.CORNER);
      //

      PGraphics overlay = this.infoPanel.overlay;
      overlay.beginDraw();
      overlay.background(0, 170);
      overlay.noStroke();
      overlay.fill(255);
      overlay.textSize(18);
      for (int i = 0; i < this.pushbuttons.size(); i++)
        overlay.text("getPushButton(" + i + "): " + this.getPushButton(i), 10, 25 + i * 20);
      for (int i = 0; i < this.pushbuttons.size(); i++)
        overlay.text("getPushButtonOnce(" + i + "): " + this.getPushButtonOnce(i), 10, 85 + i * 20);
      for (int i = 0; i < this.potentiometers.size(); i++)
        overlay.text("getPotentiometer(" + i + "): " + PApplet.nf(this.getPotentiometer(i), 0, 2) + " raw: "
            + this.potentiometers.get(i).value, 245, 25 + i * 20);
      for (int i = 0; i < this.potentiometers.size(); i++)
        overlay.text("getPotentiometer(" + i + ", 0.02): " + PApplet.nf(this.getPotentiometer(i, 0.02f), 0, 2)
            + " raw: " + this.potentiometers.get(i).value, 245, 85 + i * 20);
      overlay.endDraw();

      this.parent.image(overlay, this.infoPanel.x, this.infoPanel.y); // Draw the overlay onto the main canvas
      this.parent.popStyle();
      this.parent.hint(PConstants.ENABLE_DEPTH_TEST);
    }
  }

  public void post() {
    // https://github.com/benfry/processing4/wiki/Library-Basics
    // you cant draw in post() but its perfect for resetting the inputButtonsOnce
    // array which needs to be done at the end of the draw cycle:

    if (this.enableKeyPress) {
      // if no Arduino is connected, and keyPresses are used, check if the frame has changed
      if (this.parent.frameCount != this.lastFrameCount)
        for (PushButton button : pushbuttons) button.pressedOnce = false;
    } else {
      for (PushButton button : pushbuttons) button.pressedOnce = false;
    }
  }

  public void pre() {

    // make sure everything in the main sketch is wrapped inside pushMatrix and
    // popMatrix, so the infopanel is always shown top left, even in 3D mode
    // pushMatrix, pushStyle in registermethod pre()
    // popMatrix, popStyle in registermethod draw()
    this.parent.pushMatrix();
    this.parent.pushStyle();
  }
}
