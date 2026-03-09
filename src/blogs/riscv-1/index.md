---
title: "Designing a CPU from Scratch"
description: "How I made a RISC-V processor play pong from scratch."
date: 2026-3-9
hidden: true
---

<script setup>
import fpga from './assets/fpga.jpg'
import pong from './assets/pong.gif'
</script>

<InlineImage :src="pong" alt="Photo of FPGA board we used to run the processor" />

This is our processor running a pong program I wrote in c. What blows my mind is that a compiler is emitting a binary that actually runs correctly on a processor I designed completely from scratch. Consider this: I have never done FPGA development before, nor have I ever formally researched CPU design. <span class="newsreader">Yet, by simply reading the RISC-V specification, I have implemented a processor correctly executing code generated from a real world compiler.</span>

<br>

# How It All Began
I have this insane pipe dream of one day browsing this very website with a computer I have created in entirely. I'm talking about the processor, the operating system, the web browser, the language used to write the operating system and web browser. All of it.

That's why when I learned about the newly forming [MIT OpenCompute](https://www.mit.edu/~ajzd/opencompute/) club, I had to join. I think I remember reading in one of their advertising emails that they wanted to develop an open source RISC-V processor design.

This is where the motivation for the project originated, but I don't want to bore you with backstory. Let's get to the important part: How it works.

<br>

# Running on an FPGA
<InlineImage :src="fpga" alt="Photo of FPGA board we used to run the processor" />

While we will do a tapeout of the processor design at some point, creating a tapeout takes a really long time and a decent amount of money. Thus, while the processer is under active development, we can run our design on special devices called FPGAs!

What is awesome about FPGAs is that you can synthesize your processor logic onto them and they will reconfigure their little logic cells to recreate the logic gates in your design. Our FPGA also comes with BRAM and some additional peripheries like a VGA output, buttons, and indicator LEDs.

FPGAs are super commonly used in hardware design and for developing different kinds of accelerators. I had never heard of them until I was introduced to them specifically for this project!

<br>

# Memory and Programs
It would be pretty difficult for out processor to compute anything without a place to load the program from. 

<div style="height: 60px;"></div>