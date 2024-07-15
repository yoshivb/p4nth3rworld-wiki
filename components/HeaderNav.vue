<script setup lang="ts">
import type { NavItem } from '@nuxt/content';
const { data: topNavigation } = await useAsyncData('navigation', () => fetchContentNavigation(queryContent("posts")), { default: () => [] });

const navigation = topNavigation.value[0].children;

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
  <header class="mb-10 mt-2">
    <nav class="flex flex-row gap-4 justify-between w-full">
      <div class="text-xl font-bold flex flex-row gap-4">
        <NuxtLink class="py-2" to="/">Home</NuxtLink>
        <div v-for="item in navigation" class="py-2">
          <UDropdown v-if="item.children && item.children.length > 0" :items="convertNavToDropdown(item.children)" :popper="{ placement: 'bottom-start' }">
            <ULink>{{item.title}}<span class="i-heroicons-chevron-down-20-solid"></span></ULink>
          </UDropdown>
          <NuxtLink v-else :to="item._path">{{item.title}}</NuxtLink>
        </div>
      </div>
      <div class="flex flex-row gap-4 item-end">
        <UButton @click="searchShown = true">
          <Icon name="icon-park-outline:search"/>
          <p>Search...</p>
          <UKbd>{{ metaSymbol }}</UKbd>
          <UKbd>K</UKbd>
        </UButton>
        <UButton class="item-end" @click="navigateTo('https://github.com/yoshivb/p4nth3rworld-wiki',{external: true, open:{target: '_blank'}});">
          <Icon name="icon-park-outline:github-one"/>
          <p>Contribute</p>
        </UButton>
      </div>
    </nav>
  </header>
</template>
