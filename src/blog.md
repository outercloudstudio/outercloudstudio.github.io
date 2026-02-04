---
title: "Blog"
---

<script setup>
import { data as blogs } from './blogs/blogs.data.ts'
</script>

<p v-for="blog in blogs">
    <h2>{{ blog.title }}</h2>
    <div v-html="blog.excerpt"></div>
</p>