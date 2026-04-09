<script setup lang="ts">
import { onMounted, useTemplateRef, ref, computed } from 'vue';

const data = [
    {
        "name": "Liam Hanrahan",
        "site": "outercloud.dev"
    },
    {
        "name": "Armaan Gomes",
        "site": "armaangomes.com"
    },
    {
        "name": "Kevin Chang",
        "site": "changchang.me"
    },
    {
        "name": "Super Awesome Site WOW COOL",
        "site": "changchang.me"
    }
].filter(item => item.name !== 'Liam Hanrahan')

const maxLength = Math.max(...data.map(item => item.name.length))

const corruptionCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ\\/{}[]#$%&()?<>1234567890█▓▒░║╣╠©½¼=+-*■'
const commonCorruptionCharacters = '\\/{}[]#$%&()?<>█▓▒░║╣╠'

function randomCorruptionCharacter() {
    if(Math.random() < 0.5) return commonCorruptionCharacters[Math.floor(Math.random() * commonCorruptionCharacters.length)]

    return corruptionCharacters[Math.floor(Math.random() * corruptionCharacters.length)]
}

let nameIndex = 0

const text = ref(' '.repeat(maxLength - data[nameIndex].name.length) + data[nameIndex].name)

async function corrupt(newValue: string, index: number, delay: number, empty: boolean) {
    await new Promise(res => setTimeout(res, delay))

    let count = Math.random() * 3 + 5

    for(let i = 0; i < count; i++) {
        if(!empty) text.value = text.value.substring(0, index) + randomCorruptionCharacter() + text.value.substring(index + 1, text.value.length)

        await new Promise(res => setTimeout(res, 70))
    }

    text.value = text.value.substring(0, index) + ' ' + text.value.substring(index + 1, text.value.length)

    await new Promise(res => setTimeout(res, 200))

    text.value = text.value.substring(0, index) + newValue + text.value.substring(index + 1, text.value.length)
}

onMounted(() => {
    nameIndex++

    setInterval(() => {
        let firstStartingCharacter = false
        let firstTargetCharacter = false

        const newText = ' '.repeat(maxLength - data[nameIndex].name.length) + data[nameIndex].name

        for(let i = 0; i < text.value.length; i++) {
            if(text.value[i] !== ' ') firstStartingCharacter = true 
            if(newText[i] !== ' ') firstTargetCharacter = true 

            corrupt(newText[i], i, i * 20, !firstStartingCharacter && !firstTargetCharacter)
        }

        nameIndex++

        if(nameIndex >= data.length) nameIndex = 0
    }, 2000);
})

const namePadding = computed(() => {
    for(let i = 0; i < text.value.length; i++) {
        if(text.value[i] != ' ') return i - 1
    }

    return - 1
})

</script>

<template>
    <div style="height: 60px;"></div>
    
    <div class="footer">
        <span><span style="white-space: pre;">{{  ' '.repeat(namePadding + 1)  }}</span><a class="webring">{{ text.substring( namePadding + 1 ) }}</a></span>
    </div>
</template>

<style scoped>
.footer {
    position: absolute;
    bottom: 0;

    width: 100vw;

    display: flex;

    justify-content: end;
    align-items: center;

    height: 3rem;
}

.webring {
    margin-right: 20px;

    white-space: pre;

    font-family: 'jgs5';
}
</style>