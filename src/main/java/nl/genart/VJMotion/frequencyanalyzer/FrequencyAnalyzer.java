package nl.genart.VJMotion.frequencyanalyzer;

//https://github.com/benfry/processing4/wiki/Library-Basics
import ddf.minim.*;
import ddf.minim.analysis.*;
import nl.genart.VJMotion.InfoPanel;
import processing.core.PApplet;
import processing.core.PConstants;
import processing.core.PGraphics;
import processing.event.KeyEvent;

public class FrequencyAnalyzer {

  private PApplet parent;
  private Minim minim;
  AudioInputSource currentInputSource;
  private AudioPlayer audioPlayer;
  private String file;
  // private int bandsPerOctave;

  private InfoPanel infoPanel;
  private AudioInputMode currentInputMode;
  private AudioOutputMode currentOutputMode;

  private boolean enableKeyPress;
  private boolean keyPressedActionTaken;
  private float durationResetMaxValue;
  private int startTime;
  private float maxVal;
  private int bufferSize;

  public FrequencyAnalyzer(PApplet parent) {
    this.welcome();
    this.parent = parent;
    this.infoPanel = new InfoPanel(parent);

    this.enableKeyPress = true;
    this.keyPressedActionTaken = false;
    this.durationResetMaxValue = 0.0f;
    this.startTime = 0;
    this.maxVal = 0.1f; // avoid NaN when using maxVal in map() in the first frame.
    this.bufferSize = 1024;
    this.file = "https://github.com/vincentsijben/bpm-timings-for-processing/raw/main/assets/infraction_music_-_ritmo.mp3"; // default

    parent.registerMethod("draw", this);
    parent.registerMethod("pre", this);
    parent.registerMethod("post", this);
    parent.registerMethod("keyEvent", this);
    parent.registerMethod("dispose", this);
  }

  private void welcome() {
    System.out.println("##library.name## ##library.prettyVersion## by ##author.url## v24");
  }

  public FrequencyAnalyzer addMinim(Minim minim) {
    this.minim = minim;
    this.setAudioInputMode(AudioInputMode.MICROPHONE);
    return this;
  }

  // public FrequencyAnalyzer setBandsPerOctave(int bandsPerOctave) {
  // this.bandsPerOctave = bandsPerOctave;
  // //this.fft.logAverages(22, bandsPerOctave ); // 3 results in 30 bands. 1
  // results in 10 etc.
  // return this;
  // }

  public FrequencyAnalyzer setFile(String file) {
    this.file = file;
    return this;
  }

  public FrequencyAnalyzer resetMaxValueDuration(float duration) {
    this.durationResetMaxValue = duration;
    return this;
  }

  public FrequencyAnalyzer debug() {
    this.debugInfo();
    return this;
  }

  public FrequencyAnalyzer setAudioOutputMode(AudioOutputMode mode) {
    currentInputSource.setAudioOutputMode(mode);
    this.currentOutputMode = mode;
    return this;
  }

  public FrequencyAnalyzer setAudioInputMode(AudioInputMode newMode, int size) {
    if (newMode == this.currentInputMode)
      return this;
    if (currentInputSource != null) {
      currentInputSource.close();
      currentInputSource = null;
    }

    // Initialize the new input source based on the selected mode
    switch (newMode) {
      case MICROPHONE:
        currentInputSource = new MicrophoneInputSource(minim, size); // Assuming a MicrophoneSource class exists
        break;
      case LINE_IN:
        currentInputSource = new LineInInputSource(minim, size);
        break;
      case AUDIO_FILE:
        if (this.file == null)
          System.out.println("no audio file was set");

        // currentInputSource = new AudioFileInputSource(minim,
        // "https://github.com/vincentsijben/bpm-timings-for-processing/raw/main/assets/infraction_music_-_ritmo.mp3");
        // // Assuming an AudioFileSource class exists
        currentInputSource = new AudioFileInputSource(minim, size, this.file); // Assuming an AudioFileSource class
                                                                               // exists
        // "stereotest.mp3"

        break;
    }

    // Start the new input source
    if (currentInputSource != null) {
      currentInputSource.init(); // Initialize the new source
      currentInputSource.start();
    }

    // Update the current mode
    currentInputMode = newMode;
    return this;
  }

  public FrequencyAnalyzer setAudioInputMode(AudioInputMode newMode) {
    return setAudioInputMode(newMode, 1024);
  }

  //////////////////////////////////////////////////////////////
  // FFT ANALYSIS
  //////////////////////////////////////////////////////////////

  public float[] getAudioBuffer() {
    return this.currentInputSource.getAudioBuffer();
  }

  public float[] getLeftChannelBuffer() {
    return this.currentInputSource.getLeftChannelBuffer();
  }

  public float[] getRightChannelBuffer() {
    return this.currentInputSource.getRightChannelBuffer();
  }

  public void performFFT() {
    this.currentInputSource.performFFT();
  }

  public FFT getFFT() {
    return this.currentInputSource.getFFT();
  }

  public FFT getFFTLeft() {
    return this.currentInputSource.getFFTLeft();
  }

  public FFT getFFTRight() {
    return this.currentInputSource.getFFTRight();
  }

  public float getBand(int i) {
    return this.currentInputSource.getBand(i);
  }

  public float getBandLeft(int i) {
    return this.currentInputSource.getBandLeft(i);
  }

  public float getBandRight(int i) {
    return this.currentInputSource.getBandRight(i);
  }

  public int specSize() {
    return this.currentInputSource.specSize();
  }

  public int avgSize() {
    return this.currentInputSource.avgSize();
  }

  public float getAvgRaw(int index) {
    return this.currentInputSource.getAvg(index);
  }

  public float getAvgRawLeft(int index) {
    return this.currentInputSource.getAvgLeft(index);
  }

  public float getAvgRawRight(int index) {
    return this.currentInputSource.getAvgRight(index);
  }
  //// normalize the average for the given index
  // public float getAvg(int index) {
  // return this.getAvg(index, this.maxVal);
  // }

  //// set a new max value for the given index and constrain the result between 0
  //// and 1
  // public float getAvg(int index, float max) {
  // if (max <= 0.1f) return 0.0f;
  // if (this.minim == null) return 0;
  // return PApplet.constrain(PApplet.map(fft.getAvg(index), 0, max, 0, 1), 0, 1);
  // }
















  private float[] rollingMaxLevels; // stores max per band
  private float decayRate = 0.9995f; // slow decay for live input
  
/**
 * Returns the normalized volume (0 to 1) of a logarithmic frequency band.
 * This only works after calling fft.logAverages(22, 3), which splits the audible
 * range into ~30 musically spaced bands.
 *
 * @param band the log band index (0 = low bass, up to ~29 = high treble)
 * @return normalized volume between 0 and 1 for that band
 */
public float getVolume(int band) {
  float currentValue = this.currentInputSource.getAvg(band);

  // Initialize array for rolling max per log band
  if (rollingMaxLevels == null || rollingMaxLevels.length != this.currentInputSource.avgSize()) {
      rollingMaxLevels = new float[this.currentInputSource.avgSize()];
      for (int i = 0; i < rollingMaxLevels.length; i++) {
          rollingMaxLevels[i] = 1.0f;
      }
  }

  // Rolling max with decay
  if (currentValue > rollingMaxLevels[band]) {
      rollingMaxLevels[band] = currentValue;
  } else {
      rollingMaxLevels[band] *= decayRate;
  }

  return PApplet.constrain(currentValue / rollingMaxLevels[band], 0, 1);
}

/**
 * Returns the overall normalized volume (0 to 1) across all frequency bands.
 * This gives you a single value representing the "energy" of the current sound.
 *
 * @return average normalized volume across all log frequency bands
 */
public float getVolume() {
  float sum = 0;
  int count = this.currentInputSource.avgSize();

  for (int i = 0; i < count; i++) {
      sum += getVolume(i); // uses smoothed, normalized log bands
  }

  return sum / count;
}

















  public void resetMaxValue() {
    this.maxVal = 0.1f;
  }

  //////////////////////////////////////////////////////////////
  // KEYBOARD + MOUSE
  //////////////////////////////////////////////////////////////
  public FrequencyAnalyzer disableKeyPress() {
    this.enableKeyPress = false;
    this.infoPanel.enableKeyPress = false;
    return this;
  }

  private void toggleMuteOrMonitoring() {
    if (currentInputSource.isMonitoring())
      currentInputSource.disableMonitoring();
    else
      currentInputSource.enableMonitoring();

    // todo: add muted toggle?
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

    System.out.println(event.getKeyCode());
    if (!this.keyPressedActionTaken) {
      // use F1, F2, F3 etc keys to switch modes
      // eg. keyCode 97 is F1 in P3D or P2D mode
      // eg. keyCode 112 is F1 in default renderer
      if (event.getKeyCode() == 97 || event.getKeyCode() == 112) {
        // F1 key pressed
        this.setAudioInputMode(AudioInputMode.AUDIO_FILE);
      }
      if (event.getKeyCode() == 98 || event.getKeyCode() == 113) {
        // F2 key pressed
        this.setAudioInputMode(AudioInputMode.MICROPHONE);
      }
      if (event.getKeyCode() == 99 || event.getKeyCode() == 114) {
        // F3 key pressed
        this.setAudioInputMode(AudioInputMode.LINE_IN);
      }
      if (event.getKeyCode() == 100 || event.getKeyCode() == 115) {
        // F4 key pressed
        this.toggleMuteOrMonitoring();
      }
      if (event.getKeyCode() == 101 || event.getKeyCode() == 116) {
        // F5 key pressed
        this.resetMaxValue();
      }
    }
    // handle long press events, only works in default renderer, not in P2D or P3D
    this.keyPressedActionTaken = true; // Set the flag to true to avoid repeating the action

  }

  private void onKeyRelease(KeyEvent event) {
    // Reset the flag when the key is released, allowing for the action to be taken
    // on the next key press
    this.keyPressedActionTaken = false;
  }

  //////////////////////////////////////////////////////////////
  // INFOPANEL
  //////////////////////////////////////////////////////////////
  public FrequencyAnalyzer showInfoPanel() {
    this.infoPanel.show = true;
    return this;
  }

  public FrequencyAnalyzer setInfoPanelY(int y) {
    this.infoPanel.y = y;
    return this;
  }

  public FrequencyAnalyzer setInfoPanelKey(char keyboardKey) {
    this.infoPanel.keyboardKey = keyboardKey;
    return this;
  }

  public void draw() {
    // make sure everything in the main sketch is wrapped inside pushMatrix and
    // popMatrix, so the infopanel is always shown top left, even in 3D mode
    // pushMatrix in registermethod pre()
    // popMatrix in registermethod draw()
    this.parent.popMatrix();
    this.parent.popStyle();

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

      for (int i = 0; i < this.avgSize(); i++) {
        float xR = (i * overlay.width) / this.avgSize();
        float yR = 150;

        overlay.fill(255);
        this.maxVal = 100;

        if (this.currentOutputMode == AudioOutputMode.STEREO) {
          float h = PApplet.lerp(0, -100, this.getAvgRawLeft(i));
          h = PApplet.constrain(h, -100, 0);
          overlay.rect(xR, yR, overlay.width / this.avgSize() / 2, h);
          h = PApplet.lerp(0, -100, this.getAvgRawRight(i));
          h = PApplet.constrain(h, -100, 0);
          overlay.rect(xR + overlay.width / this.avgSize() / 2, yR, overlay.width / this.avgSize() / 2, h);
        } else {
          float h = PApplet.lerp(0, -100, this.getAvgRaw(i));
          h = PApplet.constrain(h, -100, 0);
          overlay.rect(xR, yR, overlay.width / this.avgSize(), h);
        }

        overlay.fill(255, 0, 0);
        overlay.textAlign(PApplet.CENTER, PApplet.CENTER);
        if (this.currentOutputMode == AudioOutputMode.STEREO) {
          overlay.textSize(10);
          overlay.text(PApplet.round(PApplet.lerp(0, maxVal, this.getAvgRawLeft(i))),
              xR + (overlay.width / this.avgSize() / 4), yR - 20);
          overlay.text(PApplet.round(PApplet.lerp(0, maxVal, this.getAvgRawRight(i))),
              xR + (overlay.width / this.avgSize() / 4 * 3), yR - 20);
        } else {
          overlay.textSize(14);
          overlay.text(PApplet.round(PApplet.lerp(0, maxVal, this.getAvgRaw(i))),
              xR + (overlay.width / this.avgSize() / 2), yR - 20);
        }
        overlay.textSize(8);
        overlay.text(i, xR + (overlay.width / this.avgSize() / 2), yR - 6);
      }
      overlay.fill(255);
      overlay.textSize(16);
      overlay.textAlign(PApplet.LEFT);

      // overlay.textAlign(PApplet.CENTER);
      // overlay.text("maxVal: " + PApplet.round(maxVal), this.parent.width/2, 30);
      // overlay.textAlign(PApplet.LEFT);
      String s = "selected mode: " + this.currentInputMode;
      overlay.text(s, 15, 30);
      if (this.currentInputMode == AudioInputMode.AUDIO_FILE && audioPlayer != null)
        overlay.text("muted: " + audioPlayer.isMuted(), overlay.width - 120, 30);
      // else overlay.text("monitoring: " + (audioInput.isMonitoring() ? "on": "off"),
      // overlay.width-120, 30);
      else
        overlay.text("monitoring: " + (currentInputSource.isMonitoring() ? "on" : "off"), overlay.width - 120, 30);
      overlay.endDraw();
      this.parent.image(overlay, this.infoPanel.x, this.infoPanel.y, this.infoPanel.w, this.infoPanel.h); // Draw the
                                                                                                          // overlay
                                                                                                          // onto the
                                                                                                          // main canvas

      this.parent.popStyle();
      this.parent.hint(PConstants.ENABLE_DEPTH_TEST);
    }
  }

  public void post() {
    // https://github.com/benfry/processing4/wiki/Library-Basics
    // you cant draw in post() but its perfect for the fft analysis:
  }

  public void pre() {
    if (this.minim != null) {
      this.performFFT();

      // determine max value to normalize all average values
      // for (int i = 0; i < fft.avgSize(); i++) if (fft.getAvg(i) > this.maxVal)
      // this.maxVal = fft.getAvg(i);
      // if (this.durationResetMaxValue > 0.0f) {
      // if (parent.millis() - this.startTime > this.durationResetMaxValue) {
      // this.resetMaxValue();
      // startTime = parent.millis();
      // }
      // }
    }
    // make sure everything in the main sketch is wrapped inside pushMatrix and
    // popMatrix, so the infopanel is always shown top left, even in 3D mode
    // pushMatrix in registermethod pre()
    // popMatrix in registermethod draw()
    this.parent.pushMatrix();
    this.parent.pushStyle();
  }

  public void dispose() {
    // might not be necessary, but just in case
    if (currentInputSource != null)
      currentInputSource.close();
    if (this.minim != null)
      this.minim.stop();
  }

  private void debugInfo() {
    long millis = System.currentTimeMillis();
    java.util.Date date = new java.util.Date(millis);
    System.out.println(date);

    System.out.println("Your OS name -> " + System.getProperty("os.name"));
    System.out.println("Your OS version -> " + System.getProperty("os.version"));
    System.out.println("Your OS Architecture -> " + System.getProperty("os.arch"));
    if (minim != null) {
      System.out.println("MONO -> " + minim.getLineIn(Minim.MONO));
      System.out.println("STEREO -> " + minim.getLineIn(Minim.STEREO));
      // System.out.println("buffer size: " + this.audioInput.bufferSize());
      // System.out.println( "sample rate: " + this.audioInput.sampleRate());
    }
  }
}
