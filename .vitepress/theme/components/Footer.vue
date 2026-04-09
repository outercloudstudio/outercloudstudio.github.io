<script setup lang="ts">
import { onMounted, useTemplateRef, ref, computed } from 'vue';

const webringLink = useTemplateRef('webring-link')

const corruptionCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ\\/{}[]#$%&()?<>1234567890█▓▒░║╣╠©½¼=+-*■'
const commonCorruptionCharacters = '\\/{}[]#$%&()?<>█▓▒░║╣╠'

function randomCorruptionCharacter() {
    if(Math.random() < 0.5) return commonCorruptionCharacters[Math.floor(Math.random() * commonCorruptionCharacters.length)]

    return corruptionCharacters[Math.floor(Math.random() * corruptionCharacters.length)]
}

let nameIndex = 0

const text = ref('')
const url = ref('')

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

let data: { name: string, site: string }[] = []
let maxLength = Math.max(...data.map(item => item.name.length))

async function fetchWebring() {
    const now = Date.now()

    const rawData = await fetch('https://raw.githubusercontent.com/outercloudstudio/webring-friends/refs/heads/main/sites.json')
    data = await rawData.json() as { name: string, site: string }[]

    data = data.filter(item => item.name !== 'Liam Hanrahan').map(item => ({ name: 'Friend Site → ' + item.name, site: item.site}))
    
    maxLength = Math.max(...data.map(item => item.name.length))

    text.value = ' '.repeat(maxLength)

    const after = Date.now()
    const delay = after - now

    await new Promise(res => setTimeout(res, Math.max(0, 500 - delay)))

    updateWebringLink()

    setInterval(() => {
        if(webringLink.value?.matches(':hover')) return

        updateWebringLink()
    }, 3000);
}

function updateWebringLink(){
    let firstStartingCharacter = false
    let firstTargetCharacter = false

    const newText = ' '.repeat(maxLength - data[nameIndex].name.length) + data[nameIndex].name

    for(let i = 0; i < text.value.length; i++) {
        if(text.value[i] !== ' ') firstStartingCharacter = true 
        if(newText[i] !== ' ') firstTargetCharacter = true 

        corrupt(newText[i], i, i * 20, !firstStartingCharacter && !firstTargetCharacter)
    }

    const pastIndex = nameIndex

    setTimeout(() => {
        url.value = 'https://' + data[pastIndex].site
    }, 400);

    nameIndex++

    if(nameIndex >= data.length) nameIndex = 0
}

onMounted(() => {
    fetchWebring()
})

const namePadding = computed(() => {
    for(let i = 0; i < text.value.length; i++) {
        if(text.value[i] != ' ') return i - 1
    }

    return text.value.length
})

</script>

<template>
    <div style="height: 60px;"></div>
    
    <div class="footer">
        <span><span style="white-space: pre;">{{  ' '.repeat(namePadding + 1)  }}</span><a class="webring" :href="url" ref="webring-link" target="_blank">{{ text.substring( namePadding + 1 ) }}</a></span>
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

    font-family: 'Departure';
    font-size: 16.5px;
}
</style>