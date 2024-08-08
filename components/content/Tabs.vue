<script setup lang="ts">

import {useSlots} from 'vue';
const slots = useSlots();

const items = computed(()=>{
    return Object.keys(slots).map((key) => {return {key: key, label: key}; })
});

const selectedKey = ref(items.value[0].key);


</script>

<template>
    <div class="flex flex-row gap-2">
        <div class="flex flex-col bg-primary-400 rounded-lg p-2 w-48">
            <UButton :class="{'dark:bg-primary-500': selectedKey == item.key}"
                v-for="item of items" @click="selectedKey = item.key">
                <span class="truncated">{{ item.label }}</span>
            </UButton>
        </div>
        <div>
            <div :class="{hidden: item.key !== selectedKey}" v-for="item of items">
                <h1>{{ item.label }}</h1>
                <slot :name="item.key"></slot>
            </div>
        </div>
    </div>
</template>