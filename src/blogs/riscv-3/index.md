---
title: "Achieving Out Of Order in My CPU"
description: "Implementing out of order execution in my CPU design."
longDescription: "I just finished implementing the new revision of the CPU design I've been working on. Now we support out of order execution. In this blog I explain a bit about how the out of order execution is done and also discuss what bottlenecks I found while debugging programs."
date: 2026-8-25
---

<script setup>
import DiagramImg from './assets/diagram.png'
</script>

<img :src="DiagramImg" />

<div style="height:60px" />

Last Sunday I finished up some final bug fixes for the latest revision of my CPU design. I'm now calling it the Dawn Processor because this project is supposed to be a fresh attempt at developing a high performance RISC-V processor. This latest revision comes with the major development that the design now supports out of order execution to take advantage of instruction level parallelism. This implementation is still rather naive, but it is a good proof of concept and also was able to give a ton of good insight into what future work I'll need to do to start achieving performance competitive with commercial processors. First, I want to explain a bit about how the processor works before moving into it's limitations and how that can guide future development.

## Instruction Level Parallelism
The canonical execution model for ISAs like RISC-V is to execute each instruction in the order it appears in the program. This makes sense and feels familiar to how software engineers often write code. If, my code comes later in the program, I expect it to execute after code the comes earlier.

Out of order cores recognize that we don't always need to follow this restriction. If two instructions in our program are entirely independent, then maybe we don't care in what order they execute in, and maybe we can even execute them at the same time.

This revision of the Dawn Processor only has an issue width of 1. That means we can only issue (dispatch an instruction to be processed) one instruction at a time. While this means we won't be able to execute two additions at once, we can take advantage of something else that's super important, hiding memory latency.

In the RV32-I base instruction set, you can realistically execute every instruction in a single cycle except for memory instructions, especially if you are interfacing with RAM. In our previous in order core, we would have to wait for a memory instruction to finish, before we could process any new instructions. However, with the new out of order core, we don't need to wait for the memory instruction to finish before executing more instructions, as long as they are independent. With this ability we can complete memory instructions and ALU instructions at the same time in parallel.

But what does it mean for an instruction to be independent? Simply, if an instruction writes to a register and a later instructions reads that value, the second instruction depends on the first. For example:
```asm
lw x1, 200(x0) // Load the value at 0x200 in memory and store it in register x1
addi x1, x1, 1 // Increment register x1 by 1
```
<br>

In this case, the `addi` instruction depends on the `lw` instruction because the `addi` instructions reads the value written by the `lw` instructions. This is known as a true data dependence. In this case, we would have to wait for the `lw` instruction to complete before executing the `addi` instruction. However, consider this example instead:
```asm
lw x1, 200(x0) // Load the value at 0x200 in memory and store it in register x1
addi x2, x2, 1 // Increment register x2 by 1
```
<br>

Now that the `addi` instruction reads `x2` it no longer depends on the `lw` instruction. This processor revision could execute the `addi` before the `lw`, even though the `addi` instruction occurs later in the program.

## Tracking Dependence
In order to know that an instruction is free to execute, we need to be able to track that it no longer has any dependencies. This core revision is a bit unconventional because we do not do any register renaming, which means that the way it tracks dependencies might be very different from other out of order cores. Honestly, I'm not sure because I haven't referenced an out of order core implementation yet.

The core contains a structure called the instruction dispatch queue (IDQ). This is where instructions wait until they are free to execute before being sent off to a processing element like the ALU. The IDQ uses a structure I'm calling the dependency length table (DLT). It keeps a counter for every register. When an instruction enters the IDQ the DLT increments the counter that corresponds to the register the instruction will write to. The instruction also stores the values of the counters of the registers the instruction needs to read from. Then, whenever an instruction is done finishing, the new register values is broadcasted backwards in what I call a `free broadcast` in the code. When a `free broadcast` occurs, we decrement the counter for that register in the DLT. We also decrement the counter value stored in all of the instructions in the IDQ. Instruction can only dispatch from the IDQ when the counter (dependency size) for all of their registers is 0.

Essentially, this means that each instruction tracks how many writes to a specific register must occur before it is free to execute.

## Limitation 1: Jumps / Flushes are Really Bad
One of the first big inefficiencies I noticed while debugging the processor is that the full pipeline gets flushed a lot. Whenever the core takes a jump or branch, it has the flush the whole pipeline. This essentially stalls execution for a number of cycles. The exact number depends but it's something around 7 cycles. We have to do this since the instruction pointer updates greedily and fills in the pipeline with instructions as if there were no jumps. However, when we jump that leaves a bunch of invalid instructions in the pipeline, so we have to flush the whole thing to purge any invalid instructions.

Implementing a simple branch predictor would help a ton here. The core already could support branch prediction without too much extra work. A branch predictor will be one of the goals for the next revision.

## Limitation 2: Memory Quickly Bottlenecks
I intentionally kept memory handling in the core simple. The core only allows one memory instruction in flight at a time. (It's actually more restrictive, the core will only dispatch a memory instruction when that instruction is the oldest untired instruction in the reorder buffer.) While debugging the test pong program you might have seen in earlier blogs, I noticed that the IDQ essentially fills up with memory instructions, until there's one last slot at the top where new instructions trickle in. Fundamentally there's not too much you can do if you just need to execute a ton of memory instructions and you're limited on memory bandwidth. However, in our case there's a number of improvements we can make. With some smart memory reordering and also caching, we can reduce the stalling due to memory filling up the pipeline quite a bit.

[Armaan](https://armaangomes.com/) just started working on improving this aspect, so hopefully we'll be able to see a nice speedup soon.

## Conclusion
Soon we'll get DOOM running on this out of order revision, just like we got it running on the last version of the processor. Future work on the core will likely involve adding branch prediction, improved memory handling, and achieving a wider issue width. At the moment we haven't synthesized the design yet on the FPGA, so we'll also likely be doing that soon.

We've still got a bit of a ways to go before we've achieve anything close to the performance of a modern processor, but we're working on it. Armaan and I have decided that our big goal we should reach for is the fastest open source RISC-V processor in the world. Hopefully soon we'll get up there as one of the fastest, but we'll need to beat BOOM and XiangShan first in order to claim that title.

<Quote>"The first step to achieving the impossible is believing you can." - Me</Quote>