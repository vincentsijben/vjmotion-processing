# VJMotion library for Processing

## Introduction
VJMotion is a small library for Processing that provides easy to use helper functions. Create dynamic, audio-reactive visuals that move with the music. This Processing library is designed for live performance, combining BPM-synced animations, real-time audio analysis, and physical input via Arduino. Whether you're building generative art for stage shows, interactive installations, or classroom performances, this toolkit makes it easy to connect sound, motion, and control into one expressive visual experience. 

You could animate (grow or shrink) shapes in any amount of beats, or delay shrinking a shape to start after 6 beats. Or have a shape change it's color using an Arduino potentiometer or based on the volume of some microphone input.

### Context
This library was originally created in 2023 for the Maastricht Institute of Arts - GenArt exposition. Students were showcasing their generative art work that could be controlled with a custom built Arduino controller. The work was BPM based; a live band performed on stage while students acted as VJ's, controlling their own digital work through the Arduino controller. For the exposition and performance of 2024, this library was expanded with 2 additional classes: [ArduinoControls](ArduinoControls.md) and [FrequencyAnalyzer](FrequencyAnalyzer.md).

<table width="100%">
  <tr>
    <td valign="top" align="center" width="50%"><a href="https://vimeo.com/911124908/735f46dc5b?share=copy"><img src="assets/thumbnail-video1.jpg" alt="Generative Art Exposition and Performance in Maastricht 2023" width="300"/></a><br>GenArt Expo 2023 (Dutch version)</td>
    <td valign="top" align="center" width="50%"><a href="https://vimeo.com/1013689471/da1bcb3048?share=copy"><img src="assets/thumbnail-video2.jpg" alt="Generative Art Exposition and Performance in Maastricht 2024" width="300"/></a><br>GenArt Expo 2024 (English version)</td>
  </tr>
 </table>

Students collaborated with several artists. Click the thumbnail for more information:

<table width="100%">
  <tr>
    <td valign="top" align="center" width="33%"><a href="https://vincentsijben.github.io/vjmotion-processing/triana-y-luca.html">Triana y Luca<br><img src="assets/artist-triana-y-luca.jpeg" width="100%" alt="Artist Triana y Luca" /></a></td>
    <td valign="top" align="center" width="33%"><a href="https://vincentsijben.github.io/vjmotion-processing/ananya-samyt.html">Ananya Samyt<br><img src="assets/artist-ananya-samyt.jpg" width="100%" alt="Artist Ananya Samyt" /></a></td>
    <td valign="top" align="center" width="33%"><a href="https://vincentsijben.github.io/vjmotion-processing/gogo.html">Gogo<br><img src="assets/artist-gogo.jpg" width="100%" alt="Artist Gogo" /></a></td>
  </tr>
 </table>


## Installation
Install the library by downloading the latest release through the Processing contribution manager. Open Processing and go to `Sketch > Import Library... > Manage Libraries...` , search for **VJMotion** and click install.

Please read the [documentation website](https://vincentsijben.github.io/vjmotion-processing/) for more information on how to use this library.
