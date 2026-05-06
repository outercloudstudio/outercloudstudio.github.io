---
title: "We Launched a Duct Taped Foam Box 90,000ft"
description: "I lead software for LEONIRD-I, the high altitude baloon MIT Satelite team launched this weekend. We got some great footage above the earth."
longDescription: "I lead software for LEONIRD-I, the high altitude baloon MIT Satelite team launched this weekend. We got some great footage above the earth, and I got to work with radio coms to track the baloon live as we chased it down."
date: 2026-4-5
hidden: false
---

<script setup>
import aboveEarth from './assets/above-earth.png'
import greenBuildingView from './assets/green-building-view.jpg'
import argusBoard from './assets/argus-board.jpg'
import launch from './assets/launch.jpg'
import dashboard from './assets/dashboard.png'
import flightPath from './assets/flight-path.png'
import recovered from './assets/recovered.jpg'
import selfie from './assets/selfie.jpg'
</script>

<img :src="aboveEarth" />

<div style="height:60px" />

This is the last image we recorded before the GoPro mounted on the outside of the payload died. This picture was taken from about 51,000 ft up at around 42.82938°N 71.7019°S. The GoPro's fisheye lens does make the earth look more curved than it actually is, but besides that, I think this picture is absolutely insane. <span class="newsreader">We captured this image ourselves. With hardware we built in only two months.</span>

<br>

## Flight Software and Comms
<InlineImage :src="argusBoard"/> 
The control center of the balloon was our ARGUS board. This is a board design from a class at CMU. On this board, we had a RP2350 processor connected to a number of peripherals. Components like a LORA radio, GPS, IMU, and I2C line. It was also supposed to be connected to an SD card reader, but trust me, we tried to get that to work. Many man hours were spent resodering the SD card lines to try and get it to work, but at some point we just had to call it and use a SD card over I2C. The board was programmed in Python, based on the code from CMU's FSW-Mainboard repository. [Here's our fork](https://github.com/MITSatellite-Team/FSW-mainboard).

The board's job was to collect sensor data, such as the GPS location and temperature reading from I2C, and then send that information over the LORA radio.

To collect the radio packets emitted by the ARGUS board, we programmed a few different microcontrollers that we called `beacons`. Their job was simply to capture the radio packet, deserialize it, and log the data over serial.

<InlineImage :src="greenBuildingView"/>

We called the first beacon `Beacon 1`. We put it on top of the [Green Building](https://en.wikipedia.org/wiki/Green_Building_(MIT)), connected to a large antenna up there. To set it up, I got to go up there and take some cool photos. <Emoticon>:)</Emoticon>

The second beacon I called `Feldspar`, inspired by the character from Outer Wilds. This microcontroller came with us during the chase. We ziptied an antenna to the top of our chase car and fed the radio wire from it into the microcontroller. Truly scuffed but amazing nonetheless.

We called our third beacon `Riebeck`. Its job was actually supposed to pick up a backup radio and GPS signal, but we got rid of the component last minute to reduce weight.

## Launch
<InlineImage :src="launch"/>
Launch was a bit precarious. We completely emptied both of our helium tanks entirely and the payload was barely under neutrally buoyant. We needed either a lot more helium (which we didn't have) or we were going to have to shed some weight.

We ripped out our muon detecters, one of the backup GPS, and some camera components. I believe this saved us about `1.5 lbs`, leaving the payload at `3.5 lbs`. We originally expected that the balloon would rise faster, even with the lighter payload, the reduced helium left it rising slower than anticipated. This meant that our flight was going to be longer than we expected.

## Chase
Each of our beacons were pushing their readings live to a backend I quickly wrote and hosted on a Google virtual machine. The backend was a simple Bun web server that saved the data to a SQLite database. I also created a dashboard with Vue and Vite that was also served from this virtual machine. We used this dashboard to track the balloon's location as well as monitor its live sensor data. I particularly thought that it was cool how low the pressure became as it's altitude climbed.

<br>

<img :src="dashboard" />

<br>
<br>

<InlineImage :src="flightPath"/>
The predicted landing location shifted while we were following the balloon. At one point, the balloon was predicted to land in the Atlantic Ocean, and then the prediction shifted to Northern Maine. However, the balloon's true path began in New York, flew through Massachusetts, before finally landing in rural New Hampshire.

Of course, we stopped at Chick-fil-A for lunch along the way.

## Recovery
While at Chick-fil-A, we noticed the balloon was beginning to lose altitude on the dashboard, and it was falling fast. Analysing the data later showed that it was falling somewhere between `30-20 m/s` in the upper atmosphere, slowing down to around `6 m/s` closer to the ground. Because it was going so fast close to the ground, I doubt the parachute properly deployed. At this point, we were only tracking the balloon from `Beacon 1` on the green building. The balloon had travelled too far for our mobile `Feldspar` beacon to pick it up. At around `900 m` above the ground, we lost connection to the payload. Our last packet came in at `5:06:33 PM EST`.

Based on its speed and height, I calculated that it fell for about two more minutes before impacting the ground nearby in Dover, New Hampshire. We expected to lose radio connection to `Beacon 1` once the payload neared the ground, but we hoped that as we grew near, `Feldspar` would begin picking up the connection again. However, as we neared the predicted landing site, we got absolutely nothing. On top of this, all of our backup GPS had failed. We had originally set up four GPS.
1. Main ARGUS board GPS transmitted over LORA (Lost connection)
2. SPOT backup (Never got a connection during flight)
3. APRS tracking (Died in flight)
4. Backup GPS (Ripped out for weight)

Our last hope was an Airtag that had been duck taped into the payload. Still, we drove around where we thought the payload might have landed until it got too dark. We notified the local authorities and then headed home.

Turns out, the Airtag was our best idea. On Monday, the Airtag got picked up by someones phone, and suddenly we had the location of the payload.

<InlineImage :src="recovered"/>
Once the payload was brought back to campus, I downloaded all of the footage off of the GoPro and then took a look at the board. The impact cracked a lot of the 3D printed structure in the payload. It also looks like the impact somehow completely reset the boards BIOS. I genuinely have no idea how that happened. It completely deleted all of our flight code and all of the files stored on the processor. That would explain why we weren't able to pick up any further radio on `Feldspar` once we arrived nearby. Other than that, the board still worked fine. 

## Closing Thoughts
Launching this high altitude was genuinely so cool. I also really enjoyed working with the long range radio, and I think it's amazing that we can build these long range communication devices that don't rely on an internet connection. I also think the footage we recovered from the GoPro is genuinely incredible. If only the battery had lasted long enough for us to see the entire flight. An idea for next time!

I'm super glad I got to contribute to this project, and thank you to everyone on MIT Satelite team who helped make this miracle build in two months possible.

<br>
<img :src="selfie" />
<br>
<p style="max-width: max-content; margin: auto auto">Photo of everyone who came out to launch.</p>
<br>
<br>

We're not done with Satellite team yet. Look out for more stuff about them in the future. [Here's the website](https://satellite.mit.edu/) if you want to check it out.