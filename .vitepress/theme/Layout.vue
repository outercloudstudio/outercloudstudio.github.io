<script setup lang="ts">
import Home from './views/Home.vue'
import NotFound from './views/NotFound.vue'
import Blog from './views/Blog.vue'

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

	<Blog v-else />
</template>
