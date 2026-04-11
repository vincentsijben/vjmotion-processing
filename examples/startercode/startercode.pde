/**
 * Project: [Your project title]
 * Author: [Your full name]
 * Vimeo URL: [Your vimeo share link]
 *
 * Description: [summarize your work in a few lines]
 * Controls: [list all the controls of this work and what they do (keypresses, mousepresses, Arduino push buttons, potentiometers etc)]
 * Source materials: [list all the sources you've used and explain your enhancements]
 **/

void setup() {
  size(1920, 1080);
  // fullScreen() // use fullScreen() instead of size() when performing!
  
  VJ_Motion_setup();
}

void draw() {
  VJ_Motion_draw();
}
