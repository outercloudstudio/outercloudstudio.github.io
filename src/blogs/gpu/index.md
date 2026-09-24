---
title: "Building a GPU in 24 Hours"
description: "We won 2nd overall at HackMIT for building a GPU in 24 hours."
longDescription: "My team won 2nd overall at HackMIT last weekend! We decided to try building a GPU in 24 hours. We extended an open source RISC-V processor architecture with GPU machinery to accelerate programs with high parallelism. I want to give a overview of the architecture additions and some cool programs we ran on it."
date: 2026-9-24
---

<script setup>
import StageImg from './assets/stage.png'
import TvImg from './assets/tv.jpg'
import VectorLanesDiagram from './assets/vector-lanes-diagram.png'
import WarpDiagram from './assets/warp-diagram.png'
import InferenceImg from './assets/inference.png'
import DoomImg from './assets/doom.png'
</script>

<img :src="StageImg" />

<div style="height:60px" />

Over the weekend I participated in HackMIT 2026. We ended up winning 2nd overall by designing and implementing a GPU in only 24 hours. A number of people have hasked how we did it, so here we go!

## GPU Architecture
My PI likes to say that GPUs are machines made to generate a lot of work. He means that the parallelism GPUs are help us do a lot of work. Why just add one number, when I can add thousands at once? This is where we get *vector lanes.*

<img :src="VectorLanesDiagram" />

<div style="height:40px" />

In our architecture, we have 16 *vector lanes.* Each vector lane can process it's own bit of data, but all of the vector lanes have to do the same operation (share an instruction). This is called the SIMD programming model. One simple example is that we want to add 16 pairs of numbers.

```js
c_1 = a_1 + b_1
c_2 = a_2 + b_2
c_3 = a_3 + b_3
...
c_16 = a_16 + b_16
```
<br>

Without vector lanes, a simple CPU would take minimally 16 cycles to compute each addition at 1 cycle per addition. But, with our vector lanes, it only takes one cycle! We can do all of the additions at the same time. That's a **16x speedup**, which is roughly what we were able to achieve on some programs.

In the diagram, you can see there are 16 ALUs. Each ALU is deignated to one vector lane and computes the result for that vector lane. Also shown in the diagram is the *Vector Register File.* It's labeled as having 2048 registers, which is a lot! The RISC-V 32I ISA only specifies 32. Actually, each vector lane has it's own set of 32 regiters. 32 x 16 = 512.

Wait, 512 < 2048. That's because of *Warps!*

<img :src="WarpDiagram" />

<div style="height:40px" />

Another way to help the GPU do more work is to swap out which instructions we're executing when we would otherwise have to wait. This is called hardware multithreading. On our GPU, we developed the concept of warps. When a memory operation would force our processor to stall, we would swap out the currently executing instructions with the instructions from another warp.

Unfortunately, I'm not actually sure warps helped significantly like the vector lanes. I think this is mostly just an issue with our pipeline in combination with the memory access times that weren't too long (~15 cycles).

To get a bit technical here, when we detected we would stall due to a memory instruction, we would flush the stages of the pipeline from `Fetch` to `Execute` (leaving `Write` unflushed). Then, the pipleine has to fill up again. So, we lose around 5 cycles to this. Theoretically we can execute about 10 more instructions before the original memory result returns. That's assuming there's no other shenanigans within those 10 cycle!

In summary, we had hardware multithreading, but we think it only helped marginally. Our implementation support 4 warps, each warp had it's own set of vector lanes. This gives us 32 x 16 x 4 = 2048 registers.

## Cool Progams
It took us about 14 hours to get a working architecture running on our FPGA. We still had a big problem: We had no programs to show off!

<img :src="TvImg" />

<div style="height:40px" />

Of course, we had to do 3D rendering on our GPU. In the image you can see a mesh being rendered using the FPGA. Another thing that always looks really cool is fluid simulations, so we did have a fluid simulation demo. Also, you can't mention GPUs without AI practically getting shouted out, so we ran a small LLM that generated tiny stories.

<img :src="InferenceImg" />

<div style="height:40px" />

And of course, we couldn't design a procesor without trying to run DOOM on it.

<img :src="DoomImg" />

<div style="height:40px" />

There you have it. That's how our GPU works, and some of the programs we were able to run on it. Thanks for being curious! And thank you to my amazing team: [Armaan Gomes](https://armaangomes.com/), Yoland Hu, and Kshemaahna Nagi.

<Quote>You didn't get this far by giving up, did you? - Toby Fox</Quote>