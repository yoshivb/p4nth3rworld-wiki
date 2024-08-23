<script setup lang="ts">

import {useSlots} from 'vue';
const slots = useSlots();

const items = computed(()=>{
    return Object.keys(slots).map((key) => {return {key: key, label: key}; })
});
</script>

<template>
    <div class="grid grid-cols-[1fr_auto] gap-2">
        <div class="grid grid-cols-[repeat(auto-fill,_minmax(300px,1fr))] grid-rows-[repeat(auto-fill,_400px)] gap-4">
            <div v-for="item of items" 
                class="rounded-lg bg-zinc-700 p-4 overflow-y-auto"
                style="clip-path: border-box;" >
                <ProseH2 class="m-2 mb-4 text-center" :id="item.key">{{ item.label }}</ProseH2>
                <slot :name="item.key"></slot>
            </div>
        </div>
        <div class="flex flex-col w-56">
            <h2 class="m-2">Table of Contents</h2>
            <NuxtLink v-for="item of items" 
                :href="`#${item.key}`" variant="ghost"
                class="p-2 ">
                <span class="truncated">{{ item.label }}</span>
            </NuxtLink>
        </div>
    </div>
</template>