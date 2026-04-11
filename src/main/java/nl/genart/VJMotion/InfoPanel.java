package nl.genart.VJMotion;

import processing.core.PApplet;
import processing.core.PGraphics;
import processing.event.KeyEvent;

public class InfoPanel {
  PApplet parent;
  public int x;
  public int y;
  public int w;
  public int h;
  public char keyboardKey;
  public boolean show;
  public PGraphics overlay;
  private boolean keyPressedActionTaken;
  public boolean enableKeyPress;

  public InfoPanel(PApplet parent) {
    this(parent, parent.width, 150);
  }

  public InfoPanel(PApplet parent, int _w, int _h) {
    this.parent = parent;
    this.x = 0;
    this.y = 0;
    this.w = _w;
    this.h = _h;
    this.keyboardKey = 'i';
    this.show = Boolean.FALSE;
    this.keyPressedActionTaken = false;
    this.enableKeyPress = true;
    this.overlay = parent.createGraphics(_w, _h);

    parent.registerMethod("keyEvent", this);
  }

  public void keyEvent(KeyEvent event) {
    if (this.enableKeyPress) {
      if (event.getAction() == KeyEvent.PRESS) this.onKeyPress(event);
      else if (event.getAction() == KeyEvent.RELEASE) this.onKeyRelease(event);
    }
  }

  private void onKeyPress(KeyEvent event) {
    
    if (event.getKey()==this.keyboardKey && !this.keyPressedActionTaken) {
      this.show = !this.show;
      this.keyPressedActionTaken = true;
    }
  }

  private void onKeyRelease(KeyEvent event) {
    this.keyPressedActionTaken = false;
  }
}
