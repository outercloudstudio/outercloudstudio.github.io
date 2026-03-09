---
title: "Designing a CPU from Scratch"
description: "How I made a RISC-V processor from scratch with no experience."
date: 2026-3-9
hidden: true
---

<script setup>
import fpga from './assets/fpga.jpg'
import pong from './assets/pong.gif'
</script>

<InlineImage :src="pong" alt="Photo of FPGA board we used to run the processor" />

This is a RISC-V processor from scratch with no hardware design experience. Just recently, [we](https://github.com/MIT-OpenCompute) achieved compiling a pong program written in `C` to the processor and displaying interactive video on a disply through `VGA`. If you're interested in how CPUs work, hardware design, or just want to see a processor designed from scratch, <span class="newsreader">this blog is for you.</span>

<br>

# What Can the CPU Do
<InlineImage :src="fpga" alt="Photo of FPGA board we used to run the processor" />

The CPU conforms to the RISC-V unprivileged integer instruction specification. This means it can execute any programs compiled for this architecture. The CPU has one core and has part of it's memory address spaced mapped to a `320x240 8-bit` color framebuffer for displaying video on a screen as well as a space in adress mapped for reading input from buttons directly on the board. The clock runs at `25 Mhz` and can execute one instruction per `every 2` clock cycles. (Except for memory instructions which take three clock cycles). <span class="newsreader">This is definitely not the fastest we can go.</span> I can think of one easy optimization that would double our speed right now, but that's for future me. The CPU design is also being run on an FPGA board. We are planning on doing a real tapeout of the CPU to get it on real silicon, but we want to improve the processor's performance before we spend the money to do a tapeout.

<br>

# How It Works
The four main imporant components of the processor are the:
1. Memory Controller
2. Decoder
3. Instruction Logic
4. VGA Controller

## Memory
On our FPGA we have to be careful about how we configure our memory. We only have a limited number of read-write ports into BRAM, which is where we are storing our program and all of the program's memory. The memory controller's job is to help manage our memory and redirect any special memory requests to the write components. On the current design of the processor we define about `4KB` of memory with `32 bit` wide read-write ports. The memory is addresseble for every `32 bits` so we often need to use both read-write ports to handle memory reads and writes that fall across these memory boundries. The size of our memory is kind of just an arbitrary number and isn't capped at `4kB`, that's just what we had defined when we were running pong.

The memory controller also has special adress ranges designated for special behaviours. Any address from `0x4000` to `0x4AFFFFFF` would instead write to a framebuffer for the VGA display. Any read at `0x4B000000` would return the state of 4 buttons on the FPGA board. This way programs could easily interface with the extra component on the board by simply reading and writing to memory.

## Decoder
When we fetch an instruction from memory, we send it through our `Decoder` module. This helps decode any immediate values in the instructions and helps simplify the instruction logic. Hilariously like other parts of this CPU, the `Decoder` is essentially just one giant switch statement that routes bits from the encoded instruction to the right places.

This is a snippet from our `Decoder.scala` file:
```scala
switch(opcode) {
    is(0b0110111.U) { format := InstructionFormat.U; } // lui
    is(0b0010111.U) { format := InstructionFormat.U; } // auipc
    is(0b0010011.U) { format := InstructionFormat.I; } // addi, slti, sltiu, xori, ori, andi, slli, srli, srai
}

switch(format){
    is(InstructionFormat.R) {
        io.operation := io.instruction(31,25) ## io.instruction(14,12) ## io.instruction(6,0);
    }
    is(InstructionFormat.I) {
        io.operation := io.instruction(14,12) ## io.instruction(6,0);
        io.immediate := Fill(21, io.instruction(31,31)) ## io.instruction(30,20);
    }
    is(InstructionFormat.S) {
        io.operation := io.instruction(14,12) ## io.instruction(6,0);
        io.immediate := Fill(21, io.instruction(31,31)) ## io.instruction(31,25) ## io.instruction(11,7);
    }
}
```

## Instruction Logic
The instruction logic is also a giant switch statement, except this time the switch statement affects registers and memory. For simplicity, until we implement `out-of-order execution`, the CPU has a simple stage system. During `stage 0`, the instruction is loaded from memory. In `stage 1`, most instructions execute. Some instructions that deal with memory also have a `stage 2` where they do some additional work since reading from BRAM takes a clock cycle. 

```scala
when(stage === 1.U) {
    switch(decoder.io.operation) {
        // LB
        is("b000_0000011".U) {}

        // LH
        is("b001_0000011".U) {}

        // LW
        is("b010_0000011".U) {}

        // LBU
        is("b100_0000011".U) {}
    }
}
```

## VGA Controller
To render video to a screen, the CPU also contains a VGA controller. The VGA controller defined a chunk of `320x240 8-bit` memory for the framebuffer. The VGA controller would then render this framebuffer onto any display connected to the VGA input on the FPGA board. The resolution is the VGA controller emits is actually `640x480`, but because of the limitted memory on the FPGA, we chose to make the framebuffer at half resolution.

<br>

# How We Made It

<br>

# Fun Tid-Bits

<div style="height: 60px;"></div>