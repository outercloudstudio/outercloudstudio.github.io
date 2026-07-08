---
title: "Rendering Fonts Quickly in WebGPU"
description: "A cool technique from a recently expired Microsoft patent lets us render TTF fonts quickly on the GPU."
longDescription: ""
date: 2026-7-6
hidden: true
---

<script setup>
import AnimooHeroImg from './assets/animoo-hero.gif'
import GlyphImg from './assets/glyph.png'
import LerpImg from './assets/lerp.gif'
</script>

<img :src="AnimooHeroImg" />

<div style="height:60px" />

Last month I started working on a WebGPU animation renderer so that I could
render animations directly in the web for the blog. It's not quite done yet, but
along the way I've managed to implement a very cool technique for rendering TTF
fonts. The technique comes from work by Loop and Blinn,
[Resolution independent curve rendering using programmable graphics hardware](https://dl.acm.org/doi/pdf/10.1145/1073204.1073303).
According to Google,
[this work](https://patents.google.com/patent/US7564459B2/en) was patented by
Microsoft in 2005, and just expired in March this year.

The technique is actually suprisingly elegant for the GPU and I think it's
really cool. In order to understand this technique from scratch, I'm going to
break down a little bit of everything, from fonts to graphics rendering and
splines.

<span class="newsreader">By the way, the animated GIF at the top was rendered
using this technique!</span>

## My True Type Font is Telling Lies Again

Let's start with True Type fonts (`.ttf`) because they are the one true font
format. Open Type fonts (`.otf`) are almost the exact same structure as True
Type fonts, and Web Open Font Format (`.woff` and `.woff2`) fonts are
essentially just wrappers that compress True Type and Open Type fonts. So,
understanding True Type fonts is basically all you need.

The format in which TTF encodes its information is frankly over engineered and
very boring so I'm going to just completely skip that. You can check out
[Tomek Czajecki's blog post](https://tchayen.github.io/posts/ttf-file-parsing)
on TTF file parsing if your interested.

Characters in TTF fonts are made of glyphs. Each glyph is made up of paths,
which are in turn each made up of curves.

1. Font
2. Character
3. Glyphs
4. Paths
5. Curves

<img :src="GlyphImg" />

<div style="height:40px" />

Each blue point in the `a` glyph is a start and end point for a curve. Each red
point is a control point. Control points control (haha) the curvature of a
curve. You can also see, for example, on the stem of the glyph some of the lines
don't have a control point. When reading the curve data, I just add the control
point back on the line, keeping it straight.

The `a` glyph is made of two paths. Looking at the image closely, you can see
black arrows indicating the direction of each path. When the path is constructed
clockwise, it is drawn filled in. When the path his constructed counter
clockwise, it cuts out of the filled in area.

There's a neat little trick for detecting whether a path is clockwise or
counterclockwise.

```ts
for (const point in points) {
    area += 1 / 2 * (lastPoint.x * point.y - point.x * lastPoint.y)
}

if (area > 0) {
    counterClockwise()
} else {
    clockwise()
}
```

<br>

This is just some pseudocode since dealing with the path properly is a bit
messy. You can see the actual source
[here](https://github.com/outercloudstudio/animoo/blob/f3b28d1beab5a046679d10166d96eefce5bb421b/src/elements/letter.ts#L293). We'll eventually use this to decide wether to use the contour of the shape as a cutout when we generate the triangualted mesh.

## It's a Spliny Slope

Each curve in a TTF font is defined by three points: start, end, and control
points. This is kind of curve is called a quadratic spline.

One really nice way to draw out the curve of a spline is with simple `lerps`.

```ts
function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t
}
```

<br>

Lerp is a super useful and common function in video games and graphics that **L**inearly int**ERP**olates between two values based on a `t` from `0` to `1`. That looks like this:

<img :src="LerpImg" />

<br>

A quadratic spline is just a simple combination of three lerps.

```ts
function splinePoint(start: Vector2, end: Vector2, control: Vector2, t: number) {
    const a = new Vector2(lerp(start.x, control.x, t), lerp(start.y, control.y, t))
    const b = new Vector2(lerp(control.x, end.x, t), lerp(control.y, end.y, t))

    return new Vector2(lerp(a.x, b.x, t), lerp(a.y, b.y, t))
}
```

<br>

Insert spline image here.

This construction is known as Casteljau's Algorithm. While this method is really nice for tracing out a spline's shape, it doesn't help us fill in a curve like we need to render our fonts. Instad, we need to talk about triangles for second.

## GPUs Only Want One Thing, and It's Triangles
A good mental model for thinking about the work that GPUs do when rendering graphics is to think in triangles and pixels. First create a bunch of triangles, and then you shade in each pixel on the triangle. When shading in each pxiel on a triangle, each pixel runs it's own tiny function in isolation. 

Since every pixel runs on it's own in isolation, we can't exactly use Casteljau's Algorithm. Casteljau's Algorithm gives 