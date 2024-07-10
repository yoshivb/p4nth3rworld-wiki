<script lang="ts" setup>
import Highlighter from 'vue-highlight-words';
import { refDebounced, useEventListener } from '@vueuse/core'

const isShown = useState('showSearch');

const input = ref();
const search = ref('');
const dropdownItems = ref<any[]>([]);

watch(
  isShown,
  () => {
    if (isShown) {
      search.value = '';
      nextTick(() => {
        input.value.$refs.input.focus()
      });
    }
  },
)

useEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    isShown.value = !isShown.value;
    e.preventDefault();
  }
  if(e.key === "Escape")
  {
	isShown.value = false;
	e.preventDefault();
  }
})

const debouncedSearch = refDebounced(search, 100)

watch(debouncedSearch, async (v) => {
	if (v) {
		const result = await searchContent(v, {});
		console.log(result.value);
		dropdownItems.value = result.value.map((i): any => {
			let shortenedContent = i.content.length > 28 ? i.content.slice(0, 25) + "..." : i.content;
			if(i.match[i.terms[0]].includes("content"))
			{
				let foundIndex = i.content.toLowerCase().indexOf(i.terms[0].toLowerCase());
				let startIndex = Math.max(0, foundIndex-25);
				let endIndex = Math.min(foundIndex+25, i.content.length);
				shortenedContent = "..." + i.content.slice(startIndex, endIndex) + "...";
			}
			return {
				id: i.id,
				title: i.title || 'Untitled',
				to: i.id,
				content: shortenedContent,
				terms: i.terms
			};
		})
	}
	else {
		dropdownItems.value = []
	}
});
</script>

<template>
	<div v-if="isShown" class="fixed inset-0 z-10 flex items-center justify-center">
		<div class="absolute inset-0 -z-10 bg-black bg-opacity-75" @click="isShown = false"></div>
		<div class="overflow-hidden h-1/3 w-1/2 bg-slate-700 grid rounded-md" style="grid-template-rows: max-content 1fr;">
			<div class="items-center">
				<UInput ref="input" v-model="search" placeholder="Search..." />
			</div>
			<div class="overflow-y-auto py2 flex flex-col">
				<div class="p-1" :to="c.to" v-for="c, idx in dropdownItems">
					<UButton class="flex flex-row justify-between w-full" @click="navigateTo(c.to); isShown = false;">
						<p>{{ c.title }}</p>
						<Highlighter 
							:search-words="c.terms"
							:text-to-highlight="c.content"/>
					</UButton>
				</div>
			</div>
		</div>
	</div>
</template>