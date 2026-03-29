<script setup lang="ts"></script>

<template>
    <span class="emoticon">
        <slot />
    </span>
</template>

<style scoped>
.emoticon {
    white-space: nowrap;
    margin: 0px 2px;

    font-family: 'jgs', Arial, Helvetica;
}
</style>