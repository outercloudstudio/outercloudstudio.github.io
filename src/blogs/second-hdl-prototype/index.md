---
title: "Introducing My Second Assault on Hardware Design"
description: "Looking at what a placement oriented HDL might look like"
longDescription: "This blog is to help me describe a potential hardware description language. It's written mostly as if the language COOL NAME already existed, however it does not exist yet!"
date: 2026-8-17
hidden: true
---

<script setup>
</script>

This blog is to help me describe a potential hardware description language. It's written mostly as if the language **COOL NAME** already existed, however it does not exist yet!

-----

<br>

I want to introduce you to a language I've been working on called **COOL NAME**. **COOL NAME** is not a standard programming language. It's a hardware description language, which means that our code can be used to generate designs for FPGAs. Other HDLs may be used for ASIC synthesis as well, but **COOL NAME** is specifically built for FPGA synthesis. Certain FPGA designs make heavy use of special hard blocks like DSPs and achieving high performance on these designs often requires efficient use of these hard blocks. **COOL NAME** was built from the observation that we can help guide synthesis tools into efficient use of DSPs and design layout by giving the programmer the ability to designate an operation to be synthesized to a specific DSP within the language.

Let's see what this looks like:

```ts
const multiply = a.mul(b)
const result = Register.pipeline(multiply, 3, io.in.clock, io.in.clear)

result.pin({ type: 'DSP48', x: 4, y: 380})
```
<br>

Alternatively it might be useful to instantiate hard blocks like Verilog modules:

```ts
const result = DSP48.pipelined3Multiply(a, b, io.in.clock, io.in.clear, { x: 4, y: 380 })
```
<br>

Now that we have a concrete idea of what code in **COOL NAME** might look like, let's look at the benefits and interesting consequences of supporting this kind of hard block specification in a HDL.

## Improved Hard Block Utilization
Synthesis tools try to infer where to synthesize hard blocks from Verilog RTL. [FPGA Technology Mapping Using
Sketch-Guided Program Synthesis](https://dl.acm.org/doi/pdf/10.1145/3620665.3640387) shows us that this isn't perfect, in fact it's not even close to correctly inferring when to correctly synthesize a single DSP most of the time. For example, the paper reports that SOTA on Xilinx succeeds in finding a single DSP mapping about 30% of the time on their microbenchmarks. And Yosys seems to find DSP synthesis only around 3% of the time!

Giving the programmer the ability to inform the synthesis tool where to synthesize a DSP allows us to improve our design's utilization of hard blocks using information we know as the programmer about our design.

## Guiding Placement
Previous to  **COOL NAME**, I was experimenting with a different language that let you control synthesis differently, but if suffered majorly from the fact that locking down too much of the placement and routing around your hard blocks makes it difficult to make compact designs, leading to poorer timing performance and resource utilization. **COOL NAME** differs from this: **COOL NAME** does not overly restrict the synthesis of logic surrounding the hard block definitions. The synthesis tool will automatically synthesize additional logic surrounding the hard blocks.

This actually allows the programmer to control a bit of the layout of the design by choosing where to place the DSPs in addition to what should be synthesized as a DSP.

## Placement is Global (Not Modular?)
Other work like the paper I linked previously already attempts to tackle the issue of improving hard block utilization, however **COOL NAME** attempts to also explore what is capable when we can also control placement, not just synthesis. However, when we also specify placement, we run into the important restriction that not only are hard block grids not regular on the FPGA fabric, we must specify every hard block onto exactly one unique location. This makes using modules a bit more tricky. We might want to define modules that are instantiated multiple times and also specify placement. This means that placement becomes a parameter of module instances and not just the module specification itself. This just means we might have to process some modules multiple times to generate individual version specifying different hard block placements.

I think it still remains to be seen if it's possible to create some nice way of representing placements in a modular way. I haven't be able to come up with one yet, but who knows!

## Pin vs. Direct Instantiation
At the beginning of this blog, I showed two different code snippets. One which used a `pin` function to specify the DSP and another which instantiates the DSP directly.

```ts
// Pin
const multiply = a.mul(b)
const result = Register.pipeline(multiply, 3, io.in.clock, io.in.clear)

result.pin({ type: 'DSP48', x: 4, y: 380})

// Direct Instantiation
const result = DSP48.pipelined3Multiply(a, b, io.in.clock, io.in.clear, { x: 4, y: 380 })
```
<br>

There's a slight difference in the how each is used here that I think is important to note. Using `pin` is nice because it allows you to easily incrementally specify placement. Pinning the operation to a DSP is separated from the logical computation. However, I'm not sure how we can make sure the register pipeline and multiply all get combined into a single DSP. I don't want to have to try and infer what to include within the DSP, because this is just replicating the same problem the FPGA synthesis tools have but at a higher level. That's why I also proposed the direct instantiation syntax. We don't have to worry about inferring what is included in the pin because the DSP is the object itself we are instantiating.

A third possible solution, is to reframe pinning from something done on a single operation, to something done to a group of operations:
```ts
const multiply = a.mul(b)
const result = Register.pipeline(multiply, 3, io.in.clock, io.in.clear)

pin([ multiply, result ], { type: 'DSP48', x: 4, y: 380})
```
<br>

There's still a problem here though. We'd likely have to do some form of graph analysis if we want to keep the nice ability to use metaprogramming to generate circuits like we see here with `Register.pipeline`. Under the hood this generates a chain of registers and returns the output signal of the last register, so simply passing in result to pin wouldn't capture the other registers unless we do some additional analysis.

## What's Next?
Importantly it remains to be seen what level of improved performance we can achieve over normal synthesis flows with this new found control over synthesis and placement. I'll likely continue working on an optimized systolic array design to help make this comparison.