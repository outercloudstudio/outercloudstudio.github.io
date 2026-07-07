---
title: "Rendering Fonts Quickly in WebGPU"
description: "A cool technique from a recently expired Microsoft patent lets us render TTF fonts quickly on the GPU."
longDescription: ""
date: 2026-7-6
hidden: true
---

<script setup>
import AnimooHeroImg from './assets/animoo-hero.gif'
</script>

<img :src="AnimooHeroImg" />

<div style="height:60px" />

Last month I started working on a WebGPU animation renderer so that I could render animations directly in the web for the blog. It's not quite done yet, but along the way I've managed to implement a very cool technique for rendering TTF fonts. The technique comes from work by Loop and Blinn, [Resolution independent curve rendering using programmable graphics hardware](https://dl.acm.org/doi/pdf/10.1145/1073204.1073303). According to Google, [this work](https://patents.google.com/patent/US7564459B2/en) was patented by Microsoft in 2005, and just expired in March this year.

The technique is actually suprisingly elegant for the GPU and I think it's really cool. In order to understand this technique from scratch, I'm going to break down a little bit of everything, from fonts to graphics rendering and splines.

# My True Type Font is Telling Lies Again
Let's with True Type fonts (`.ttf`) because they are the one true font format. Open Type fonts (`.otf`) are almost the exact same structure as True Type fonts, and Web Open Font Format (`.woff` and `.woff2`) fonts are essentially just wrappers that compress True Type and Open Type fonts. So, understanding True Type fonts is basically all you need.

The format in which TTF encodes its information is frankly over engineered and very boring so I'm going to just completely skip that. You can check out [Tomek Czajecki's blog post](https://tchayen.github.io/posts/ttf-file-parsing) on TTF file parsing if your interested.

Characters in TTF fonts are made of glyphs. 



# GPUs Only Want One Thing, and It's Triangles

# It's a Spliny Slope