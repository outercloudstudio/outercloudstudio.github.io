<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'

const { site, frontmatter, page } = useData()

const is404 = computed(() => page.value.isNotFound)
</script>

<template>
	<nav>
		<div class="nav-links">
			<a href="/">{{ frontmatter.title === 'Home' ? '>' : '' }}Home</a>

			<a href="/blog">{{ frontmatter.title === 'Blog' ? '>' : '' }}Blog</a>

			<a href="/projects">{{ frontmatter.title === 'Projects' ? '>' : '' }}Projects</a>
		</div>

		<div class="nav-links">
			<a href="/experience">{{ frontmatter.title === 'Experience' ? '>' : '' }}Experience</a>

			<a href="/contact">{{ frontmatter.title === 'Contact' ? '>' : '' }}Contact</a>
		</div>
	</nav>

	<img class="hero-image" src="./outer-cloud-art-light.png" draggable="false" />

	<div v-if="frontmatter.home" class="home">
		<h1 class="headline">For the <span class="accent-headline">Love</span> of the game</h1>

		<main>
			<Content />
		</main>
	</div>

	<div v-else-if="is404">
		<h1 class="title accent-headline">How'd you get here?</h1>

		<main>
			<p>There's been a 404 error. Here let's go <a href="/">back home.</a></p>
		</main>
	</div>

	<div v-else>
		<h1 class="title accent-headline" style="max-width: 40rem; margin-left: auto; margin-right: auto">{{ frontmatter.title }}</h1>

		<h3 v-if="frontmatter.date !== undefined" class="page-date">
			{{ new Date(frontmatter.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/New_York' }) }}
		</h3>

		<main>
			<Content />
		</main>
	</div>
</template>
