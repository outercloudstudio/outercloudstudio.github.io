<script setup lange="ts">
import { useData } from 'vitepress'

const { site, frontmatter, page } = useData()
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
</template>

<style scoped>
nav {
    display: flex;
    
    padding: 16px;

    position: sticky;
    top: 0px;

    z-index: 2;

    justify-content: space-between;

    background: var(--background-lt);
    border-bottom: solid 1px var(--detail-lt);
}

.nav-links {
    display: flex;

    gap: 32px;
}

@media screen and (max-width: 430px) {
    .nav {
        padding: 8px;
    }

    .nav-links {
        gap: 16px;
    }
}
</style>