<script setup lang="ts">
import { useData } from 'vitepress'

// https://vitepress.dev/reference/runtime-api#usedata
const { site, frontmatter } = useData()
</script>

<template>
	<nav>
		<a v-if="frontmatter.home" href="/blog">Blog</a>
		<a v-else href="/">Portfolio</a>
	</nav>

	<div v-if="frontmatter.home" class="home">
		<img class="hero-image" src="./outer-cloud-art-light.png" draggable="false" />

		<h1 class="headline">For the <span class="accent-headline">Love</span> of the game</h1>

		<main>
			<Content />
		</main>
	</div>

	<div v-else>
		<a href="/">Home</a>
		<Content />
	</div>
</template>
