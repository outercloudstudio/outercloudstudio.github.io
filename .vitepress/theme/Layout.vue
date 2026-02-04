<script setup lang="ts">
import { useData } from 'vitepress'

// https://vitepress.dev/reference/runtime-api#usedata
const { site, frontmatter } = useData()
</script>

<template>
	<nav>
		<div class="nav-links">
			<a href="/">{{ frontmatter.title === 'Home' ? '>' : '' }}Home</a>

			<a href="/blog">{{ frontmatter.title === 'Blog' ? '>' : '' }}Blog</a>

			<a href="/projects">{{ frontmatter.title === 'Projects' ? '>' : '' }}Projects</a>
		</div>

		<a href="/contact">{{ frontmatter.title === 'Contact' ? '>' : '' }}Contact</a>
	</nav>

	<img class="hero-image" src="./outer-cloud-art-light.png" draggable="false" />

	<div v-if="frontmatter.home" class="home">
		<h1 class="headline">For the <span class="accent-headline">Love</span> of the game</h1>

		<main>
			<Content />
		</main>
	</div>

	<div v-else>
		<h1 class="title accent-headline">{{ frontmatter.title }}</h1>

		<main>
			<Content />
		</main>
	</div>
</template>
