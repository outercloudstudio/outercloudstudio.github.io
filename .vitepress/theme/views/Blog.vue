<script setup lang="ts">
import { useData } from 'vitepress'

const { frontmatter } = useData()
</script>

<template>
    <div>
        <h1 class="headline">{{ frontmatter.title }}</h1>

        <p v-if="frontmatter.date !== undefined" class="page-date">
            {{ new Date(frontmatter.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/New_York' }) }}
        </p>

        <main>
            <Content />
        </main>
    </div>
</template>

<style scoped>
.page-date {
    display: block;

    text-align: center;

    margin: -3rem 0 3rem 0;

    font-weight: 500;

    font-size: 1.25rem;
}
</style>