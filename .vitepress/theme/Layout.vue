<script setup lang="ts">
import Home from './views/Home.vue'
import NotFound from './views/NotFound.vue'

import Nav from './components/Nav.vue'

import { useData } from 'vitepress'
import { computed } from 'vue'

const { site, frontmatter, page } = useData()

const is404 = computed(() => page.value.isNotFound)
</script>

<template>
	<Nav />

	<img class="hero-image" src="./outer-cloud-art-light.png" draggable="false" />

	<Home v-if="frontmatter.home" />

	<NotFound v-else-if="is404" />

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
