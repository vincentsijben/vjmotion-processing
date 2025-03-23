var __index = {"config":{"lang":["en"],"separator":"[\\s\\-]+","pipeline":["stopWordFilter"]},"docs":[{"location":"index.html","title":"VJMotion library for Processing","text":"<p>A Processing library that helps you create live, audio-reactive visuals with BPM-synced animations, Arduino controls, and real-time motion driven by music.</p> <p></p> <p>This documentation provides information on</p> <ol> <li>Getting started</li> <li>BPM functions</li> <li>Arduino Controls</li> <li>Frequency Analyzer</li> <li>Artist Ananya Samyt</li> <li>Artist Gogo</li> <li>Artist Triana y Luca</li> <li>Contribute</li> </ol>"},{"location":"ananya-samyt.html","title":"Ananya Samyt (Instagram)","text":"<p>Singer, live performer, producer and Dj Ananya Samyt takes her Colombian and Indian heritage as the main influence for her music. </p> <p>During her Jazz studies at the Conservatorium Maastricht, she started a fusion of jazz and electronic music production, whilst adding some of her magic sounds and inspiration that reflects the vibrant diversity of her heritage. </p> <p>She will perform with a song from the new album she is working on right now called: \u201cElectronic&amp;Analogue Frequencies\u201d, an experimentation of dance music with synths sounds, live instruments and her voice.</p> <p></p>"},{"location":"arduinocontrols.html","title":"ArduinoControls","text":"<p>This ArduinoControls class is used at the Maastricht Institute of Arts exposition during the \"Generative Art\" semester. Students build their own Arduino remote controller with 3 potentiometers, 3 pushbuttons and 3 LEDs.</p> <p>This library simplifies the use for these controls. It adds functionality like:  - executing single commands when longpressing pushbuttons;  - multiple pushbuttons being pressed  - smooth analog potmeter values, reducing 'jumping' values  - fallback to keyboard and mouse when not using arduino  - only write LED once instead of continuously, preventing flickering</p>"},{"location":"arduinocontrols.html#usage","title":"Usage","text":"<p>Be sure to check the console to find the correct serial port. In this example port 3 (index 2) is used. <pre><code>// Import the library to your sketch\nimport bpm.library.arduinocontrols.*;\n\n// Import the arduino and serial libraries\nimport processing.serial.*;\nimport cc.arduino.*;\n\nArduino arduino;\nArduinoControls ac;\n\nvoid setup() {\n  size(500, 500);\n\n  println(Arduino.list());\n  arduino = new Arduino(this, Arduino.list()[2], 57600);\n\n  ac = new ArduinoControls(this)\n    .addArduino(arduino)\n    .addLED(13)\n    ;\n}\n\nvoid draw() {\n  background(50);\n\n  // if mouse position is to the left, turn LED on, else turn it off\n  if (mouseX &lt; width/2) ac.setLED(0, 1);\n  else ac.setLED(0, 0);\n\n  text(\"on\", width/4, height/2);\n  text(\"off\", width/4*3, height/2);\n  stroke(255, 0, 0);\n  line(width/2, 0, width/2, height);\n}\n</code></pre></p> <p>The ArduinoControls class provides the following main functions: * <code>setLEDToOn(0)</code> function that turns on the LED with index 0. If it's an LED that was set up with PWM, it uses <code>255</code>, else <code>Arduino.High</code>. * <code>setLEDToOff(2)</code> function that turns off the LED with index 2. * <code>setLED(0,200)</code> function that sets the value of LED with index 0 to 200. All values set to LEDs are only set once in draw() to prevent flickering. * <code>getPushButton(0)</code> function that returns true while the pushbutton with index 0 is being pushed. * <code>getPushButtonOnce(0)</code> function that returns true if the pushbutton with index 0 was pushed. Only returns true for the duration of 1 frame. * <code>getPotentiometer(0)</code> functon that returns the raw normalized value from potentiometer with index 0, without any smoothing * <code>getPotentiometer(0, 0.5)</code> functon that returns the smoothed normalized value from potentiometer with index 0. Smoothness is a value between 0 and 1 which adds a little delay.</p> <p>You can tweak the behaviour of this library with the following functions (you can also chain them when initializing your arduinocontrols object for clarity): * <code>.addArduino(arduino)</code> mandatory to add the global arduino object to the class. If you omit it, the keypresses associated with all controls will be enabled. * <code>.addLED(9)</code> to add an LED to the class at digital port 9. * <code>.addLED(10, LEDMode.PWM)</code> to add an LED to the class at digital port 10 as a PWM connected LED. The LEDMode argument is optional (default is <code>LEDMode.DIGITAL</code>). * <code>.addPushButton(7, '1', Arduino.LOW)</code> to add a pushbutton to the class at digital port 7, that is controllable with the keyboard key '1' when not connected and has a value of Arduino.LOW when pressed. All three arguments are mandatory. * <code>.addPotentiometer(0, 'q')</code> to add a potentiometer to the class at analog port 0, that is controllable with the mouseX position while pressing the keyboard key 'q'. Both arguments are mandatory. * <code>.showInfoPanel()</code> to show the infopanel. * <code>.setInfoPanelY(n)</code> to offset the starting y-position of the infopanel by n pixels. Useful for when you have multiple infopanels to get them all lined up. * <code>.setInfoPanelKey('u')</code> to change the hotkey to toggle the infopanel. Useful for when you have multiple infopanels. Defaults to 'i'. * <code>.disableKeyPress()</code> to disable listening for keypresses. If you don't disable keypresses, then the keys you provided as arguments for pushbuttons and potentiometers will work</p>"},{"location":"arduinocontrols.html#examples","title":"Examples","text":"<p>You can find all these examples in <code>Processing -&gt; File - Examples - Contributed Libraries - BPM timings - ArduinoControls</code>.</p> example titleimage example example titleimage example example titleimage example example titleimage example example titleimage example example titleimage example"},{"location":"bpm.html","title":"BPM functions","text":"<p>The BeatsPerMinute class provides the following main functions: * <code>linear()</code> function that returns a normalized linear progress value from 0 to 1 for any given amount of beats, or with a given delay:   * <code>linear()</code> returns progress in 1 beat   * <code>linear(4)</code> returns progress in 4 beats   * <code>linear(4,3)</code> returns progress in 4 beats, with a delay of 3 beats * <code>ease()</code> same as <code>linear()</code> but does not use a linear progression but an 'eased' or 'smooth' one. Again, can be called without arguments, with 1 argument (duration in beats) or with two (duration and delay in beats). * <code>linearBounce()</code> same as <code>linear()</code> but goes from 0 to 1 to 0 in the same amount of time. Useful for shrinking or growing of visuals. * <code>easeBounce()</code> same as <code>ease()</code> but goes from 0 to 1 to 0 in the same amount of time. Useful for shrinking or growing of visuals. * <code>every[n]</code> boolean that returns true every n beats. Returns true for the duration of 1 beat. Limited to a max of 16 beats. * <code>every_once[n]</code> same as <code>every[n]</code> but now the boolean returns true for only 1 frame. Useful for changing a variable once every n beats. * <code>getBPM()</code> to return the current BPM. * <code>getBeatCount()</code> to return the current beatcount. * <code>getSurfaceTitle()</code> show information on BPM, beatCount and frameRate in your surface title. To be used in your main sketch like <code>surface.setTitle(bpm.getSurfaceTitle());</code></p> <p>A more advanced progression function <code>adsr()</code> that uses attack, decay, sustain and release options to control the (linear) progression: * <code>adsr(0.2)</code> function that uses an attack of 20% to get from 0 to 1 and stay at 1 for the remainder of the beat * <code>adsr(0.2, 0.4, 0.5, 0.1)</code> function that uses an attack of 20% to get from 0 to 1, a decay of 40% to get to 0.5, stay for 30% of the time at that 0.5 and uses a release of 10% to get from 0.5 to 0. * <code>adsr(0.2, 0.4, 0.5, 0.1, 2)</code> similar as the previous one, but with an additional parameter for duration in beats. In this case to animate over 2 beats. * <code>adsr(0.2, 0.4, 0.5, 0.1, 2, 1)</code> similar as the previous one, but with an additional parameter for delay in beats. In this case delay of 1 beat.</p> <p>You can tweak the behaviour of this library with the following functions (you can also chain them when initializing your bpm object for clarity): * <code>.setBPM(120)</code> to change the amount of beats per minute for all calculations. * <code>.showInfoPanel()</code> to show the infopanel. * <code>.setInfoPanelY(n)</code> to offset the starting y-position of the infopanel by n pixels. Useful for when you have multiple infopanels to get them all lined up. * <code>.setInfoPanelKey('u')</code> to change the hotkey to toggle the infopanel. Useful for when you have multiple infopanels. Defaults to 'i'. * <code>.disableKeyPress()</code> to disable listening for keypresses. If you don't disable keypresses, then these keypresses will work by default:   * <code>0</code> press once to reset timer, press multiple times to set the BPM to your 'press'-timing   * <code>-</code> lower bpm   * <code>+</code> raise bpm</p>"},{"location":"bpm.html#examples","title":"Examples","text":"<p>You can find all these examples in <code>Processing -&gt; File - Examples - Contributed Libraries - VJMotion - BPM</code>.</p> animatedSVG beatCount animatedSVG delay metronome randomcolor randomGridSpots rotatingSVG adsr"},{"location":"contribute.html","title":"Contribute","text":"<p>This library was based on the official Processing Library Template which is based on Gradle. The previous version (called BPM_Timings) was based on an older Ant Template.</p> <p>I invite you to contribute to this library in all means. Please do send bug reports or give any usable feedback!</p> <p>Note</p> <p>I changed several things from the original template. I made some Pull Requests, so I hope they will be accepted soon.</p>"},{"location":"contribute.html#personal-notes-for-the-previous-ant-approach","title":"Personal notes for the previous \"Ant\" approach","text":"<p>I've copied <code>library.properties</code> to the root and called it <code>library.properties.example</code> so I could see the original comments for the file. In <code>resources\\library.properties</code> I've removed all comments, so the generated <code>distribution\\...\\.txt</code> file is clean and simple.</p>"},{"location":"contribute.html#update-test-and-release","title":"Update, test and release","text":"<ul> <li>Open Eclipse</li> <li>Update <code>src\\bpm.library\\BeatsPerMinute.java</code></li> <li>Open Ant window <code>Window -&gt; Show View - Ant</code></li> <li>drag <code>resources\\build.xml</code> to the Ant window on the right</li> <li>Run the Ant build</li> <li>Test every embedded example locally through the <code>Processing -&gt; File -&gt; Examples</code></li> <li>Commit changes to GitHub and create a new release</li> <li>Name the release <code>BPM Library Release [version] ([prettyVersion])</code> and tag it with tag [prettyVersion].</li> <li>Upload the <code>distribution\\BPM-[version]\\download\\BPM_timings.txt</code> and <code>distribution\\BPM-[version]\\download\\BPM_timings.zip</code> into the release.</li> <li>Check \"Set as the latest release\" (it should be checked by default)</li> <li>Edit the previous release. Remove the latest tag and set the appropriate [prettyVersion] tag.</li> <li>Edit the new created release, remove the [prettyVersion] tag and add the latest tag.</li> <li>You can check https://download.processing.org/contribs to check if the newest version is picked up by the automated contribution system.</li> </ul>"},{"location":"contribute.html#debugging-issues","title":"Debugging issues","text":"<ul> <li>Always check the build.properties files. I've been down a rabithole for 4 hours finding out I had changed my Documents folder location and the build.properties still had <code>sketchbook.location=${user.home}/Documents/Processing</code> instead of the new <code>sketchbook.location=${user.home}/Docs/Processing</code></li> </ul>"},{"location":"contribute.html#create-your-own-processing-library","title":"Create your own Processing Library","text":"<p>Thanks Elie Zananiri for pointing out these things...</p> <p>There are a few steps: * Package your library according to the guidelines here: https://github.com/processing/processing/wiki/Library-Guidelines * Add a properties file according to the guidelines here: https://github.com/processing/processing/wiki/Library-Basics#describing-your-library--libraryproperties * Check the revision numbers for Processing 4 here. * Publish your library and properties to a static URL according to the guidelines here: https://github.com/processing/processing/wiki/Library-Basics#advertising-your-library</p> <ul> <li>If you're hosting your library on GitHub, use the GitHub Releases feature. Create a release tagged \"latest\" and move that tag up to the new commit whenever you make an update. Note that you can also tag each release with its version number, in case you want to make older releases still available on GitHub. Check out processing-video for a good example of that.</li> </ul> <p>So my URLs are always available through: * https://github.com/vincentsijben/bpm-timings-for-processing/releases/download/latest/BPM_timings.txt * https://github.com/vincentsijben/bpm-timings-for-processing/releases/download/latest/BPM_timings.zip</p> <p>I've based my Library on the Processing Library Template. You could also check out the Coding Train tutorial. </p> <p>Note:  * use <code>classpath.local.location=/Applications/Processing.app/Contents/Java/core/library</code> instead of Daniel's example. When releasing a Library you can't have the <code>core.jar</code> in your lib folder. * Find and comment this line in your build.xml <code>&lt;taglet name=\"ExampleTaglet\" path=\"resources/code\" /&gt;</code>if you get errors with generating Javadoc. Find and remove this line in your build.xml as well <code>stylesheetfile=\"resources/stylesheet.css\"</code> * I added a symlink to each and every example folder, so I can directly open up an example in Processing IDE and add new features in the BeatsPerMinute.java file. Processing IDE needs to \"see\" the .java file in the same directory as the .pde file to work. Unfortunately I haven't found a way for these symlinks to work both on MacOS and Windows at the same time. So according to your dev environment, (re)create the symlinks when necessary. I excluded the .java file in build.xml so they won't show up in production with: <pre><code>&lt;copy todir=\"${project.tmp}/${project.name}/examples\"&gt;\n    &lt;fileset dir=\"${project.examples}\"&gt;\n        &lt;exclude name=\"**/*README*\"/&gt;\n        &lt;exclude name=\"**/*.java\"/&gt;\n    &lt;/fileset&gt;\n&lt;/copy&gt;\n</code></pre> To create symlinks: <pre><code># For MacOS: while in the root folder of this project:\nln -s ../../src/bpm/library/BeatsPerMinute.java ./examples/animatedSVG/BeatsPerMinute.java\nln -s ../../src/bpm/library/BeatsPerMinute.java ./examples/beatcount/BeatsPerMinute.java\nln -s ../../src/bpm/library/BeatsPerMinute.java ./examples/colorPalettes/BeatsPerMinute.java\nln -s ../../src/bpm/library/BeatsPerMinute.java ./examples/delay/BeatsPerMinute.java\nln -s ../../src/bpm/library/BeatsPerMinute.java ./examples/metronome/BeatsPerMinute.java\nln -s ../../src/bpm/library/BeatsPerMinute.java ./examples/randomColor/BeatsPerMinute.java\nln -s ../../src/bpm/library/BeatsPerMinute.java ./examples/randomGridSpots/BeatsPerMinute.java\n\n# For Windows: while in the root folder of this project:\nmklink .\\examples\\animatedSVG\\BeatsPerMinute.java \"..\\..\\src\\bpm\\library\\BeatsPerMinute.java\"\nmklink .\\examples\\beatcount\\BeatsPerMinute.java \"..\\..\\src\\bpm\\library\\BeatsPerMinute.java\"\nmklink .\\examples\\colorPalettes\\BeatsPerMinute.java \"..\\..\\src\\bpm\\library\\BeatsPerMinute.java\"\nmklink .\\examples\\delay\\BeatsPerMinute.java \"..\\..\\src\\bpm\\library\\BeatsPerMinute.java\"\nmklink .\\examples\\metronome\\BeatsPerMinute.java \"..\\..\\src\\bpm\\library\\BeatsPerMinute.java\"\nmklink .\\examples\\randomColor\\BeatsPerMinute.java \"..\\..\\src\\bpm\\library\\BeatsPerMinute.java\"\nmklink .\\examples\\randomGridSpots\\BeatsPerMinute.java \"..\\..\\src\\bpm\\library\\BeatsPerMinute.java\"\n</code></pre> ArduinoControls examples: <pre><code>ln -s ../../../src/bpm/library/arduinocontrols/ArduinoControls.java ./examples/ArduinoControls/basics/ArduinoControls.java\nln -s ../../../src/bpm/library/arduinocontrols/LED.java ./examples/ArduinoControls/basics/LED.java\nln -s ../../../src/bpm/library/arduinocontrols/LEDMode.java ./examples/ArduinoControls/basics/LEDMode.java\nln -s ../../../src/bpm/library/arduinocontrols/Potentiometer.java ./examples/ArduinoControls/basics/Potentiometer.java\nln -s ../../../src/bpm/library/arduinocontrols/PushButton.java ./examples/ArduinoControls/basics/PushButton.java\nln -s ../../../src/bpm/library/InfoPanel.java ./examples/ArduinoControls/basics/InfoPanel.java\n\nln -s ../../../src/bpm/library/arduinocontrols/ArduinoControls.java ./examples/ArduinoControls/all_controls/ArduinoControls.java\nln -s ../../../src/bpm/library/arduinocontrols/LED.java ./examples/ArduinoControls/all_controls/LED.java\nln -s ../../../src/bpm/library/arduinocontrols/LEDMode.java ./examples/ArduinoControls/all_controls/LEDMode.java\nln -s ../../../src/bpm/library/arduinocontrols/Potentiometer.java ./examples/ArduinoControls/all_controls/Potentiometer.java\nln -s ../../../src/bpm/library/arduinocontrols/PushButton.java ./examples/ArduinoControls/all_controls/PushButton.java\nln -s ../../../src/bpm/library/InfoPanel.java ./examples/ArduinoControls/all_controls/InfoPanel.java\n\nln -s ../../../src/bpm/library/arduinocontrols/ArduinoControls.java ./examples/ArduinoControls/smoothing/ArduinoControls.java\nln -s ../../../src/bpm/library/arduinocontrols/LED.java ./examples/ArduinoControls/smoothing/LED.java\nln -s ../../../src/bpm/library/arduinocontrols/LEDMode.java ./examples/ArduinoControls/smoothing/LEDMode.java\nln -s ../../../src/bpm/library/arduinocontrols/Potentiometer.java ./examples/ArduinoControls/smoothing/Potentiometer.java\nln -s ../../../src/bpm/library/arduinocontrols/PushButton.java ./examples/ArduinoControls/smoothing/PushButton.java\nln -s ../../../src/bpm/library/InfoPanel.java ./examples/ArduinoControls/smoothing/InfoPanel.java\n</code></pre> FrequencyAnalyzer examples: <pre><code>ln -s ../../../src/bpm/library/frequencyanalyzer/FrequencyAnalyzer.java ./examples/FrequencyAnalyzer/basics/FrequencyAnalyzer.java\nln -s ../../../src/bpm/library/frequencyanalyzer/AudioFileInputSource.java ./examples/FrequencyAnalyzer/basics/AudioFileInputSource.java\nln -s ../../../src/bpm/library/frequencyanalyzer/AudioInputMode.java ./examples/FrequencyAnalyzer/basics/AudioInputMode.java\nln -s ../../../src/bpm/library/frequencyanalyzer/AudioOutputMode.java ./examples/FrequencyAnalyzer/basics/AudioOutputMode.java\nln -s ../../../src/bpm/library/frequencyanalyzer/AudioInputSource.java ./examples/FrequencyAnalyzer/basics/AudioInputSource.java\nln -s ../../../src/bpm/library/frequencyanalyzer/MicrophoneInputSource.java ./examples/FrequencyAnalyzer/basics/MicrophoneInputSource.java\nln -s ../../../src/bpm/library/frequencyanalyzer/LineInInputSource.java ./examples/FrequencyAnalyzer/basics/LineInInputSource.java\nln -s ../../../src/bpm/library/InfoPanel.java ./examples/FrequencyAnalyzer/basics/InfoPanel.java\n\nln -s ../../../src/bpm/library/frequencyanalyzer/FrequencyAnalyzer.java ./examples/FrequencyAnalyzer/mono/FrequencyAnalyzer.java\nln -s ../../../src/bpm/library/frequencyanalyzer/AudioFileInputSource.java ./examples/FrequencyAnalyzer/mono/AudioFileInputSource.java\nln -s ../../../src/bpm/library/frequencyanalyzer/AudioInputMode.java ./examples/FrequencyAnalyzer/mono/AudioInputMode.java\nln -s ../../../src/bpm/library/frequencyanalyzer/AudioOutputMode.java ./examples/FrequencyAnalyzer/mono/AudioOutputMode.java\nln -s ../../../src/bpm/library/frequencyanalyzer/AudioInputSource.java ./examples/FrequencyAnalyzer/mono/AudioInputSource.java\nln -s ../../../src/bpm/library/frequencyanalyzer/MicrophoneInputSource.java ./examples/FrequencyAnalyzer/mono/MicrophoneInputSource.java\nln -s ../../../src/bpm/library/frequencyanalyzer/LineInInputSource.java ./examples/FrequencyAnalyzer/mono/LineInInputSource.java\nln -s ../../../src/bpm/library/InfoPanel.java ./examples/FrequencyAnalyzer/mono/InfoPanel.java\n\nln -s ../../../src/bpm/library/frequencyanalyzer/FrequencyAnalyzer.java ./examples/FrequencyAnalyzer/stereo/FrequencyAnalyzer.java\nln -s ../../../src/bpm/library/frequencyanalyzer/AudioFileInputSource.java ./examples/FrequencyAnalyzer/stereo/AudioFileInputSource.java\nln -s ../../../src/bpm/library/frequencyanalyzer/AudioInputMode.java ./examples/FrequencyAnalyzer/stereo/AudioInputMode.java\nln -s ../../../src/bpm/library/frequencyanalyzer/AudioOutputMode.java ./examples/FrequencyAnalyzer/stereo/AudioOutputMode.java\nln -s ../../../src/bpm/library/frequencyanalyzer/AudioInputSource.java ./examples/FrequencyAnalyzer/stereo/AudioInputSource.java\nln -s ../../../src/bpm/library/frequencyanalyzer/MicrophoneInputSource.java ./examples/FrequencyAnalyzer/stereo/MicrophoneInputSource.java\nln -s ../../../src/bpm/library/frequencyanalyzer/LineInInputSource.java ./examples/FrequencyAnalyzer/stereo/LineInInputSource.java\nln -s ../../../src/bpm/library/InfoPanel.java ./examples/FrequencyAnalyzer/stereo/InfoPanel.java\n</code></pre> BPM_Timing examples: <pre><code>ln -s ../../../src/bpm/library/beatsperminute/BeatsPerMinute.java ./examples/BPM_Timings/adsr/BeatsPerMinute.java\nln -s ../../../src/bpm/library/InfoPanel.java ./examples/BPM_Timings/adsr/InfoPanel.java\nln -s ../../../src/bpm/library/beatsperminute/BeatsPerMinute.java ./examples/BPM_Timings/adsrSquares/BeatsPerMinute.java\nln -s ../../../src/bpm/library/InfoPanel.java ./examples/BPM_Timings/adsrSquares/InfoPanel.java\nln -s ../../../src/bpm/library/beatsperminute/BeatsPerMinute.java ./examples/BPM_Timings/animatedSVG/BeatsPerMinute.java\nln -s ../../../src/bpm/library/InfoPanel.java ./examples/BPM_Timings/animatedSVG/InfoPanel.java\nln -s ../../../src/bpm/library/beatsperminute/BeatsPerMinute.java ./examples/BPM_Timings/basic/BeatsPerMinute.java\nln -s ../../../src/bpm/library/InfoPanel.java ./examples/BPM_Timings/basic/InfoPanel.java\nln -s ../../../src/bpm/library/beatsperminute/BeatsPerMinute.java ./examples/BPM_Timings/beatcount/BeatsPerMinute.java\nln -s ../../../src/bpm/library/InfoPanel.java ./examples/BPM_Timings/beatcount/InfoPanel.java\nln -s ../../../src/bpm/library/beatsperminute/BeatsPerMinute.java ./examples/BPM_Timings/colorPalettes/BeatsPerMinute.java\nln -s ../../../src/bpm/library/InfoPanel.java ./examples/BPM_Timings/colorPalettes/InfoPanel.java\nln -s ../../../src/bpm/library/beatsperminute/BeatsPerMinute.java ./examples/BPM_Timings/delay/BeatsPerMinute.java\nln -s ../../../src/bpm/library/InfoPanel.java ./examples/BPM_Timings/delay/InfoPanel.java\nln -s ../../../src/bpm/library/beatsperminute/BeatsPerMinute.java ./examples/BPM_Timings/metronome/BeatsPerMinute.java\nln -s ../../../src/bpm/library/InfoPanel.java ./examples/BPM_Timings/metronome/InfoPanel.java\nln -s ../../../src/bpm/library/beatsperminute/BeatsPerMinute.java ./examples/BPM_Timings/randomColor/BeatsPerMinute.java\nln -s ../../../src/bpm/library/InfoPanel.java ./examples/BPM_Timings/randomColor/InfoPanel.java\nln -s ../../../src/bpm/library/beatsperminute/BeatsPerMinute.java ./examples/BPM_Timings/randomGridSpots/BeatsPerMinute.java\nln -s ../../../src/bpm/library/InfoPanel.java ./examples/BPM_Timings/randomGridSpots/InfoPanel.java\nln -s ../../../src/bpm/library/beatsperminute/BeatsPerMinute.java ./examples/BPM_Timings/adsr/BeatsPerMinute.java\nln -s ../../../src/bpm/library/InfoPanel.java ./examples/BPM_Timings/adsr/InfoPanel.java\nln -s ../../../src/bpm/library/beatsperminute/BeatsPerMinute.java ./examples/BPM_Timings/test/BeatsPerMinute.java\nln -s ../../../src/bpm/library/InfoPanel.java ./examples/BPM_Timings/test/InfoPanel.java\n</code></pre> All_combined: <pre><code>ln -s ../../../src/bpm/library/arduinocontrols/ArduinoControls.java ./examples/All_combined/startercode/ArduinoControls.java\nln -s ../../../src/bpm/library/arduinocontrols/LED.java ./examples/All_combined/startercode/LED.java\nln -s ../../../src/bpm/library/arduinocontrols/LEDMode.java ./examples/All_combined/startercode/LEDMode.java\nln -s ../../../src/bpm/library/arduinocontrols/Potentiometer.java ./examples/All_combined/startercode/Potentiometer.java\nln -s ../../../src/bpm/library/arduinocontrols/PushButton.java ./examples/All_combined/startercode/PushButton.java\nln -s ../../../src/bpm/library/InfoPanel.java ./examples/All_combined/startercode/InfoPanel.java\nln -s ../../../src/bpm/library/frequencyanalyzer/FrequencyAnalyzer.java ./examples/All_combined/startercode/FrequencyAnalyzer.java\nln -s ../../../src/bpm/library/frequencyanalyzer/AudioFileInputSource.java ./examples/All_combined/startercode/AudioFileInputSource.java\nln -s ../../../src/bpm/library/frequencyanalyzer/AudioInputMode.java ./examples/All_combined/startercode/AudioInputMode.java\nln -s ../../../src/bpm/library/frequencyanalyzer/AudioOutputMode.java ./examples/All_combined/startercode/AudioOutputMode.java\nln -s ../../../src/bpm/library/frequencyanalyzer/AudioInputSource.java ./examples/All_combined/startercode/AudioInputSource.java\nln -s ../../../src/bpm/library/frequencyanalyzer/MicrophoneInputSource.java ./examples/All_combined/startercode/MicrophoneInputSource.java\nln -s ../../../src/bpm/library/frequencyanalyzer/LineInInputSource.java ./examples/All_combined/startercode/LineInInputSource.java\nln -s ../../../src/bpm/library/beatsperminute/BeatsPerMinute.java ./examples/All_combined/startercode/BeatsPerMinute.java\n\nln -s ../../../src/bpm/library/arduinocontrols/ArduinoControls.java ./examples/All_combined/genart_heart/ArduinoControls.java\nln -s ../../../src/bpm/library/arduinocontrols/LED.java ./examples/All_combined/genart_heart/LED.java\nln -s ../../../src/bpm/library/arduinocontrols/LEDMode.java ./examples/All_combined/genart_heart/LEDMode.java\nln -s ../../../src/bpm/library/arduinocontrols/Potentiometer.java ./examples/All_combined/genart_heart/Potentiometer.java\nln -s ../../../src/bpm/library/arduinocontrols/PushButton.java ./examples/All_combined/genart_heart/PushButton.java\nln -s ../../../src/bpm/library/InfoPanel.java ./examples/All_combined/genart_heart/InfoPanel.java\nln -s ../../../src/bpm/library/frequencyanalyzer/FrequencyAnalyzer.java ./examples/All_combined/genart_heart/FrequencyAnalyzer.java\nln -s ../../../src/bpm/library/frequencyanalyzer/AudioFileInputSource.java ./examples/All_combined/genart_heart/AudioFileInputSource.java\nln -s ../../../src/bpm/library/frequencyanalyzer/AudioInputMode.java ./examples/All_combined/genart_heart/AudioInputMode.java\nln -s ../../../src/bpm/library/frequencyanalyzer/AudioOutputMode.java ./examples/All_combined/genart_heart/AudioOutputMode.java\nln -s ../../../src/bpm/library/frequencyanalyzer/AudioInputSource.java ./examples/All_combined/genart_heart/AudioInputSource.java\nln -s ../../../src/bpm/library/frequencyanalyzer/MicrophoneInputSource.java ./examples/All_combined/genart_heart/MicrophoneInputSource.java\nln -s ../../../src/bpm/library/frequencyanalyzer/LineInInputSource.java ./examples/All_combined/genart_heart/LineInInputSource.java\nln -s ../../../src/bpm/library/beatsperminute/BeatsPerMinute.java ./examples/All_combined/genart_heart/BeatsPerMinute.java\n</code></pre></p>"},{"location":"frequencyanalyzer.html","title":"FrequencyAnalyzer","text":"<p>This FrequencyAnalyzer class is used at the Maastricht Institute of Arts exposition during the \"Generative Art\" semester. Students create sketches that react in realtime to audio input (line-in, audio file or microphone).</p> <p>This library adds functionality like:  - easily switch between input modes (audio file, microphone, line-in)  - toggle mute (audio file playing) or monitoring (microphone or line-in)</p> <p>todo:  - return raw or normalized values of specific frequency bands  - reset the max value that is used for mapping normalized values of frequency amplitudes. Can be set to an interval.</p>"},{"location":"frequencyanalyzer.html#usage","title":"Usage","text":"<pre><code>// Import the library to your sketch\nimport bpm.library.frequencyanalyzer.*;\n\n// Import the minim library\nimport ddf.minim.*;\nimport ddf.minim.analysis.*;\n\nMinim minim;\nFrequencyAnalyzer fa;\n\nvoid setup() {\n  size(500, 500);\n\n  minim = new Minim(this);\n  fa = new FrequencyAnalyzer(this)\n    .addMinim(minim)\n    .setFile(\"https://github.com/vincentsijben/bpm-timings-for-processing/raw/main/assets/infraction_music_-_ritmo.mp3\")\n    .setAudioInputMode(AudioInputMode.AUDIO_FILE)\n    ;\n}\n\nvoid draw() {\n  background(50);\n\n  circle(width/4*1, height/2, fa.getAvgRaw(0));\n  circle(width/4*2, height/2, fa.getAvgRaw(10));\n  circle(width/4*3, height/2, fa.getAvgRaw(20));\n}\n</code></pre> <p>The FrequencyAnalyzer class provides the following main functions:</p> <ul> <li><code>getAvgRaw(1)</code> returns non-normalized \"raw\" averaged amplitude for frequency band 1. The index ranges from 0 to logAverages(22, 3) which is 30 by default.</li> <li><code>getAvgRawLeft(1)</code> same as getAvgRaw(1) but specific for the left channel.</li> <li><code>getAvgRawRight(1)</code> same as getAvgRaw(1) but specific for the right channel.</li> </ul> <p>todo:</p> <ul> <li>~~<code>getBand(1)</code> returns the amplitude for frequency band 1. Used for a very specific and narrow frequency range. The index ranges from 0 to specSize().~~</li> <li>~~<code>getBandLeft(1)</code> same as getBand(1) but specific for the left channel.~~</li> <li>~~<code>getBandRight(1)</code> same as getBand(1) but specific for the right channel.~~</li> <li>~~<code>specSize()</code> returns the total amount of bands used. Typically 1025 ~~</li> <li>~~<code>avgSize()</code> returns the total amount of bands used in the logAverages function. Typically 30~~</li> <li>~~<code>getAudioBuffer()</code> returns the mixed (mono) audio buffer.~~</li> <li>~~<code>getLeftChannelBuffer()</code> returns the left audio buffer.~~</li> <li>~~<code>getRightChannelBuffer()</code> returns the right audio buffer.~~</li> </ul> <p>You can tweak the behaviour of this library with the following functions (you can also chain them when initializing your frequencyanalyzer object for clarity): * <code>.addMinim(minim)</code> mandatory to add the global minim object to the class. * <code>.setFile(\"example.mp3\")</code> to set the file for the audioplayer. Defaults to \"https://github.com/vincentsijben/bpm-timings-for-processing/raw/main/assets/infraction_music_-_ritmo.mp3\" * <code>.setAudioInputMode(AudioInputMode.AUDIO_FILE)</code> to set the input mode to AudioInputMode.AUDIO_FILE. You can also set it to AudioInputMode.LINE_IN or AudioInputMode.MICROPHONE. Defaults to AudioInputMode.MICROPHONE.  * <code>.setAudioInputMode(AudioInputMode.AUDIO_FILE, n)</code> same as previous one, but you can also set the bufferSize. Needs to be a power of 2. A lower amount results in less audio resolution and decreases delay . Defaults to 1024. * <code>.setAudioOutputMode(AudioOutputMode.STEREO)</code> to set the output mode to AudioOutputMode.STEREO. Defaults to AudioOutputMode.MONO. Use it to get access to both left and right channel analysis. * <code>.showInfoPanel()</code> to show the infopanel. * <code>.setInfoPanelY(n)</code> to offset the starting y-position of the infopanel by n pixels. Useful for when you have multiple infopanels to get them all lined up. * <code>.setInfoPanelKey('u')</code> to change the hotkey to toggle the infopanel. Useful for when you have multiple infopanels. Defaults to 'i'. * <code>.disableKeyPress()</code> to disable listening for keypresses. If you don't disable keypresses, then these keypresses will work:   * <code>CTRL + 1</code> switch to FILE mode   * <code>CTRL + 2</code> switch to MONO mode   * <code>CTRL + 3</code> switch to STEREO mode   * <code>CTRL + M</code> toggle monitoring on LINE_IN or MICROPHONE input</p>"},{"location":"frequencyanalyzer.html#examples","title":"Examples","text":"<p>You can find all these examples in <code>Processing -&gt; File - Examples - Contributed Libraries - BPM timings - FrequencyAnalyzer</code>.</p> example titleimage example example titleimage example example titleimage example example titleimage example example titleimage example example titleimage example"},{"location":"getting-started.html","title":"Getting Started","text":"<p>Thank you for trying or using this library! It's easy to set up and use. Just follow the instructions.</p>"},{"location":"getting-started.html#setting-up-the-library","title":"Setting up the library","text":"<p>Install the library by downloading the latest release through the Processing contribution manager. Open Processing and go to Sketch &gt; Import Library... &gt; Manage Libraries... , search for VJMotion and click install.</p>"},{"location":"getting-started.html#usage","title":"Usage","text":"<pre><code>import nl.genart.VJMotion.beatsperminute.*;\nBeatsPerMinute bpm;\n\nvoid setup() {\n  size(500, 500);\n  bpm = new BeatsPerMinute(this);\n  bpm.setBPM(30);\n}\n\nvoid draw() {\n  background(50);\n  circle(width/2, height/2, bpm.easeBounce()*500);\n}\n</code></pre>"},{"location":"gogo.html","title":"Gogo (Instagram)","text":"<p>Gogo is a Bulgarian artist, raised in Brussels, based in Maastricht. Inspired by the people around him, electronic and pop are the main elements which translate into a mixture of alternative and indie pop. His music seeks to encourage people to connect as well as provide the soundtrack for their journey.</p> <p>Spotify</p> <p></p>"},{"location":"triana-y-luca.html","title":"Triana y Luca (Instagram)","text":"<p>Transmitting a sincere and intimate sound, Triana and Luca are two curious artists exploring their diasporic roots through music. Intertwining Ibero-American folklores with contemporary influences, their melodies oscillate between popular music, improvisation, and poetry. </p> <p>Their project proposes a journey full of visual and poetic stimuli, inspired by cultural traditions, creative freedom, religious syncretism in art, nature, poetry and mysticism.</p> <p></p>"}]}