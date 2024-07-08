<script setup lang="ts">
import type { NavItem } from '@nuxt/content';
const { data: navigation } = await useAsyncData('navigation', () => fetchContentNavigation(), { default: () => [] });

function convertNavToDropdown(items: NavItem[]|undefined)
{
  if(items === undefined)
  {
    return undefined;
  }

  const dropdownItems = [];

  for(let item of items)
  {
    dropdownItems.push([{
      label: item.title,
      click: () => { navigateTo(item._path); }
    }]);
  }
  return dropdownItems;
}
</script>

<template>
  <header class="flex justify-between items-center mb-6">
    <div v-for="item in navigation">
      <UDropdown v-if="item.children && item.children.length > 0" :items="convertNavToDropdown(item.children)" :popper="{ placement: 'bottom-start' }">
        <ULink class="py-2">{{item.title}}<span class="i-heroicons-chevron-down-20-solid"></span></ULink>
      </UDropdown>
      <NuxtLink v-else :href="item._path" class="py-2">{{item.title}}</NuxtLink>
    </div>
  </header>
</template>
