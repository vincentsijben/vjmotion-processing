package nl.genart.VJMotion.arduinocontrols;

public class LDR {
  float value;
  float smoothValue;
  int analogPort;
  int minValue;
  int maxValue;
  char keyboardKey;

  public LDR(int analogPort, char keyboardKey, int minValue, int maxValue) {
    this.analogPort = analogPort;
    this.keyboardKey = keyboardKey;
    this.value = 0;
    this.smoothValue = 0;
    this.minValue = minValue;
    this.maxValue = maxValue;
  }
}
