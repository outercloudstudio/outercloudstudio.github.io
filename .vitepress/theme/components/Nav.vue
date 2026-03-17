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
    padding: 1rem;

    position: sticky;
    top: 0px;

    z-index: 2;

    justify-content: space-between;

    background: var(--background-lt);
    border-bottom: solid 1px var(--detail-lt);
}

.nav-links {
    display: flex;

    gap: 2rem;
}

@media screen and (max-width: 480px) {
    .nav-links {
        gap: 1.5rem;
    }
}

@media screen and (max-width: 450px) {
    .nav-links {
        gap: 1.2rem;
    }

    nav {
        padding-left: 0.5rem;
        padding-right: 0.5rem;
    }
}

@media screen and (max-width: 415px) {
    .nav-links {
        gap: 0.5rem;
    }
}
</style>