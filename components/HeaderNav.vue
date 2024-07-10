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

const searchShown = useState('showSearch');
const { metaSymbol } = useShortcuts();

</script>

<template>
  <header class="mb-6">
    <nav class="flex flex-row gap-4 justify-between w-full">
      <div class="text-xl font-bold flex flex-row gap-4">
        <div v-for="item in navigation" class="py-2">
          <UDropdown v-if="item.children && item.children.length > 0" :items="convertNavToDropdown(item.children)" :popper="{ placement: 'bottom-start' }">
            <ULink>{{item.title}}<span class="i-heroicons-chevron-down-20-solid"></span></ULink>
          </UDropdown>
          <NuxtLink v-else :href="item._path">{{item.title}}</NuxtLink>
        </div>
      </div>
      <UButton class="item-end" @click="searchShown = true">
        <Icon name="icon-park-outline:search"/>
        <p>Search...</p>
        <UKbd>{{ metaSymbol }}</UKbd>
        <UKbd>K</UKbd>
      </UButton>
    </nav>
  </header>
</template>
