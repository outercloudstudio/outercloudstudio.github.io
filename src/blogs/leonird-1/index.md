---
title: "We Launched a Duct Taped Foam Box 90,000ft"
description: "I lead software for LEONIRD-I, the high altitude baloon MIT Satelite team launched this weekend. We got some great footage above the earth."
longDescription: "I lead software for LEONIRD-I, the high altitude baloon MIT Satelite team launched this weekend. We got some great footage above the earth, and I got to work with radio coms to track the baloon live as we chased it down."
date: 2026-4-5
hidden: true
---

<script setup>
import aboveEarth from './assets/above-earth.png'
import greenBuildingView from './assets/green-building-view.jpg'
import argusBoard from './assets/argus-board.jpg'
</script>

<img :src="aboveEarth" />

<div style="height:60px" />

This is the last image we recorded before the GoPro mounted on the outside of the payload died. This picture is taken from about 51,000 ft up at about 42.82938°N 71.7019°S. The GoPro's fisheye lense does make the earth look more curved than it actually is, but besides that, I think this picture is absolutely insane. <span class="newsreader">We captured this image ourselves. With hardware we built in only two months.</span>

<br>

## Flight Software and Comms
<InlineImage :src="argusBoard"/> 
The control center of the balloon was our ARGUS board. This is a board design by a class at CMU. On this board we had a RP2350 processor connected to a number of peripherals. Components like a LORA radio, GPS, IMU, and I2C line. It was also supposed to be connected to a SD card reader, but trust me, we tried to get that to work. Many man hours were spent resodering the SD card lines to try and get it to work, but at some point we just had to call it and use a SD card over I2C. The board was programming in python, based off the code from CMU's FSW-Mainboard repository. [Here's our fork](https://github.com/MITSatellite-Team/FSW-mainboard).

The board's job was to collect sensor data, such as the GPS location and temperature reading from I2C, and then send that information over the LORA radio.

To collect the radio packets emitted by the ARGUS board, we programmed a few different microcontrollers that we called `beacons`. Their job was simply to capture the radio packet, deserialize it, and log the data over serial.

<InlineImage :src="greenBuildingView"/>

We called the first beacon `Beacon 1`. We put it on top of the [Green Building](https://en.wikipedia.org/wiki/Green_Building_(MIT)) connected to a large antenna up there. To set it up, I got to go up there and grabbed some cool photos. <Emoticon>:)</Emoticon>

The second beacon I called `Feldspar` inspired after the character from Outer Wilds. This microcontroller came with us during the chase. We ziptied an antenna to the top of our chase car and fed the radio wire from it into the microcontroller. Trully scuffed but amazing none the less.

We called our third beacon `Riebeck`. It's job was actually supposed to pick up a backup radio and GPS signal, but we got rid of the component last minute to reduce weight.
## Assembly

## Launch

## Chase

## Recovery