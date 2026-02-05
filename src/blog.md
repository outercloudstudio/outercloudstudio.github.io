---
title: "Blog"
---

<script setup>
import { data as blogs } from './blogs/blogs.data.ts'
</script>

<div v-for="blog, index in blogs">
    <div class="project-header"> <h3><a :href="blog.url">{{ blog.title }}</a></h3> <span> {{ new Date(blog.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }} </span> </div>
    <p style="margin-top: 0">{{ blog.description }}</p>
    <hr>
</div>

<div style="height: 40px;"></div>

<span class="newsreader">"One day, you're going to see it, that happiness was always about the discovery, the hope, the listening to your heart and following it wherever it chose to go."<span style="white-space: nowrap"> - <a href="https://youtube.com/shorts/uPfk1-xeFdE?si=jGi8kqt7NyDBxZnS">Bianca Sparacino</a></span></span>

<div style="height: 60px;"></div>