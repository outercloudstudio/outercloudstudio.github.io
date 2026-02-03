<script setup lang="ts">
import { useData } from 'vitepress'

// https://vitepress.dev/reference/runtime-api#usedata
const { site, frontmatter } = useData()
</script>

<template>
	<nav>
		<a href="/">Home</a>
		<a href="/blog">Blog</a>

		<div class="inner-border-l" />
		<div class="inner-border-r" />
	</nav>

	<div v-if="frontmatter.home" class="home">
		<img class="hero-image" src="./outer-cloud-art-light.png" draggable="false" />

		<h1 class="headline">It's time to bring <span class="accent-headline">Joy</span> back to the web.</h1>

		<main>
			<Content />
		</main>
	</div>

	<div v-else>
		<a href="/">Home</a>
		<Content />
	</div>
</template>
