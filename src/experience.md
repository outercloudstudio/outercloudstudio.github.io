---
title: "Experience"
---

<script setup>
import Resume from './assets/resume.pdf'
</script>

Here's my resume for completeness, although I recommend reading the [projects](./projects.md) page instead. This might not be 100% up to date, but I'll try to update when there's meaningful changes.

<object :data="Resume" type="application/pdf" width="100%" height="940px">
    <iframe :src="Resume" width="100%" height="940px" style="border:none;">
        <p>Your browser does not support viewing PDFs inline. 
           <a :href="Resume">Download the PDF instead</a>.
        </p>
    </iframe>
</object>