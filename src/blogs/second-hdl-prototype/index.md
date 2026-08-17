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

I want to introduce you to a language I've been working on called **COOL NAME**. **COOL NAME** is not a standard programming language. It's a hardware description language, which means that our code can be used to generate designs for FPGAs. Other HDLs may be used for ASIC synthesis as well, but **COOL NAME** is specifically built for FPGA synthesis. Certain FPGA designs make heavy use of special hard blocks like DSPs and achieving high performance on these designs often requires efficient use of these hard blocks. **COOL NAME** was built from the observation that we can help guide synthesis tools into efficient use of hard blocks and optimized layouts by giving the programmer the ability to specify segments of code to be placed as specific hard blocks on the FPGA fabric.

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

Now that we have a concrete idea of what code in **COOL NAME** might look like, let's look at the benefits and interesting consequences of supporting this kind of hard block specification in an HDL.

## Improved Hard Block Utilization
Synthesis tools try to infer where to synthesize hard blocks from Verilog RTL. [FPGA Technology Mapping Using
Sketch-Guided Program Synthesis](https://dl.acm.org/doi/pdf/10.1145/3620665.3640387) shows us that this isn't perfect, in fact it's not even close to correctly inferring when to synthesize a single DSP most of the time. For example, the paper reports that SOTA on Xilinx succeeds in finding a single DSP mapping about 30% of the time on their microbenchmarks. And Yosys seems to find DSP synthesis less than 3% of the time!

Giving the programmer the ability to inform the synthesis tool where to synthesize DSPs and other hard blocks allows us to improve our design's utilization of hard blocks using information we know as the programmer about our design.

## Guiding Placement
Previous to  **COOL NAME**, I was experimenting with a different language that let you control synthesis differently, but it suffered majorly from the fact that locking down too much of the placement and routing around your hard blocks makes it difficult to make compact designs, leading to poorer timing performance and resource utilization. **COOL NAME** differs from this: **COOL NAME** does not overly restrict the synthesis of logic surrounding the hard block definitions. The synthesis tool will automatically synthesize additional logic surrounding the hard blocks.

This actually allows the programmer to control a bit of the layout of the design by choosing where to place the DSPs in addition to what should be synthesized as a DSP.

## Placement is Global (Not Modular?)
Other work like the paper I linked previously already attempts to tackle the issue of improving hard block utilization, however **COOL NAME** attempts to also explore what is capable when we can also control placement, not just synthesis. However, when we also specify placement, we run into the important restriction that not only are hard block grids not regular on the FPGA fabric, we must specify every hard block onto exactly one unique location. This makes using modules a bit more tricky. We might want to define modules that are instantiated multiple times and also specify placement. This means that placement becomes a parameter of module instances and not just the module specification itself.

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

There's a slight difference in the how each is used here that I think is important to note. Using `pin` is nice because it allows you to easily incrementally specify placement. Pinning the operation to a DSP is separated from the logical computation. However, I'm not sure how we can make sure the register pipeline and multiply all get combined into a single DSP. I don't want to have to try and infer what to include within the DSP, because that is just replicating the same problem the FPGA synthesis tools suffer from but at a higher level (which could be helpful if it's easier to infer intent at the higher level, but I'm going going to assume this is still just a very hard problem <-- Lakeroad?). That's why I also proposed the direct instantiation syntax. We don't have to worry about inferring what is included in the pin because the DSP is the object itself we are instantiating.

A third possible solution, is to reframe pinning from something done on a single operation, to something done to a group of operations:
```ts
const multiply = a.mul(b)
const result = Register.pipeline(multiply, 3, io.in.clock, io.in.clear)

pin([ multiply, result ], { type: 'DSP48', x: 4, y: 380})
```
<br>

There's still a problem here though. We'd likely have to do some form of graph analysis if we want to keep the nice ability to use metaprogramming to generate circuits like we see here with `Register.pipeline`. Under the hood this generates a chain of registers and returns the output signal of the last register, so simply passing in result to pin wouldn't capture the other registers unless we do some additional analysis.

## Looking at a More Complicated Design
Let's take a look at what this might look like within a systolic array design. Since direct instantiation of hard blocks has the most clear path to implementation, that's what I've used here:
```ts
function paramaterizedPeModule(x: number, y: number) {
	return Module.define(
		`pe_module_${x}_${y}`,
		{
			in: { clock: 1, clear: 1, flush: 1, flushing: 1, a_in: 32, b_in: 32 },
			out: { a_out: 32, b_out: 32 }
		},
		io => {
			const aBuffer = Register.of(io.in.a_in, 32, Bits.uInt32(0), io.in.clock, io.in.clear)
			const bBuffer = Register.of(io.in.b_in, 32, Bits.uInt32(0), io.in.clock, io.in.clear)

			const nextAccumulate = Wire.empty()
			const accumulate = Register.of(nextAccumulate, 32, Bits.uInt32(0), io.in.clock, io.in.clear)
			accumulate.name = 'accumulate'
			
			const result = DSP48.pipelined3Multiply({
				a: aBuffer.select(0, 17), 
				b: bBuffer.select(0, 17), 
				initial: Select.from(Bits.uInt32(0), 0, 17), 
				clock: io.in.clock, 
				clear: io.in.clear,
				x,
				y,
			})
			nextAccumulate.assign(Mux.from(io.in.flushing, Bits.uInt32(0), accumulate.add(result.zExtend(32))))

			const flushBuffer = Register.of(io.in.flush, 1, Bits.bool(false), io.in.clock, io.in.clear)
			io.out.a_out.assign(Mux.from(flushBuffer, accumulate, aBuffer))
			io.out.b_out.assign(bBuffer)
		}
	)
}

const a = 16
const b = 16
const c = 16

const peArrayModule = Module.define(
	'pe_array_module',
	{
		in: { 
			clock: 1,
			clear: 1,
			flush: 1,
			flushing: 1,
			...defineIoList('a_in_', a, 32),
			...defineIoList('b_in_', b, 32),
		},
		out: {
			...defineIoList('a_out_', a, 32),
		}
	},
	io => {
		const activeConnectionsA = Array.from(Array(a).keys().map(index => io.in['a_in_' + index]))
		const activeConnectionsB = Array.from(Array(b).keys().map(index => io.in['b_in_' + index]))

		for(let indexA = 0; indexA < a; indexA++) {
			for(let indexB = 0; indexB < a; indexB++) {
				const previousAWire = activeConnectionsA[indexA]
				const previousBWire = activeConnectionsB[indexB]

				const pe = paramaterizedPeModule(DSP_LOCATIONS[indexA][indexB].x, DSP_LOCATIONS[indexA][indexB].y).instantiate(`pe_${indexA}_${indexB}`)
				pe.in.clock.assign(io.in.clock)
				pe.in.clear.assign(io.in.clear)
				pe.in.a_in.assign(previousAWire)
				pe.in.b_in.assign(previousBWire)
				pe.in.flush.assign(io.in.flush)
				pe.in.flushing.assign(io.in.flushing)

				activeConnectionsA[indexA] = pe.out.a_out
				activeConnectionsB[indexB] = pe.out.b_out
			}
		}

		for(let index = 0; index < a; index++) {
			io.out['a_out_' + index].assign(activeConnectionsA[index])
		}
	}
)
```
<br>

There are a few things I want to note about this example, first I'm dodging the conflict of modules and global placement by making the `pe` module definition a function that generates a unique module per processing element. Additionally, DSP locations are coming from some arbitrary table that I would define manually somewhere since the DSP grid isn't regular. Most of the other functions use parameter positions, but I made the `DSP48.pipelined3Multiply` take in an object with named fields to make it clearer what is being passed in.

## What's Next?
**COOL NAME** bets that we can get greater performance on our FPGA designs by giving placement control of hard blocks to the programmer through the language. While I think it is reasonable to expect there to be some performance gain possible, as manually floorplanning and other strategies to get improved synthesis and implementation are often used and even required to achieve the fastest speeds on larger designs, **COOL NAME** will need to distinguish itself by either demonstrating that providing this feature within the language allows some sort of analysis that was previously not possible, or significantly decreases the time required to spend on the manual design optimizations.