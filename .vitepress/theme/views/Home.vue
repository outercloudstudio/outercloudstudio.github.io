<script setup lang="ts"></script>

<template>
    <div class="home">
		<h1 class="headline">For the <span class="accent">Love</span> of the game</h1>

		<main>
			<Content />
		</main>
	</div>
</template>

<style scoped>
.home {
    position: relative;
}

.headline {
    text-align: center;

    margin: 96px 0px 64px 0px;

    padding: 0px 20px;

	font-family: 'Departure';
	font-size: 2.0625rem;
}

.headline.mobile { 
    margin: 1rem 0rem;
}

.accent {
    color: var(--accent);

    text-shadow: -2px 2px 0px var(--primary-lt);

	font-size: 2.75rem
}
</style>