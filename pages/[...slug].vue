<script setup lang="ts">
definePageMeta({
  layout: 'docs'
})
const route = useRoute()
const { data: page } = await useAsyncData(`docs-${route.path}`, () => queryContent(route.path).findOne());

if (!page.value) { 
    throw createError({ statusCode: 404, statusMessage: 'Page not found' });
}

useContentHead({
    head: {
        titleTemplate: () => `${page.value?.title} | P4nth3rworld Wiki`,
    }
});

console.log(page.value);
</script>

<template>
    <main>
        <div v-if="page.title != 'Home'" class="w-full flex flex-row justify-between px-2">
            <h1 class="text-balance font-extrabold text-4xl">{{ page.title }}</h1>
            <UButton @click="navigateTo(`https://github.com/yoshivb/p4nth3rworld-wiki/tree/main/content/${page?._file}`,{external: true, open:{target: '_blank'}});">
                <p>Edit</p>
                <Icon name="icon-park-outline:edit"/>
            </UButton>
        </div>
        <div class="prose prose-zinc dark:prose-invert prose-h1:text-balance max-w-none">
            <ContentRenderer v-if="page.body" :value="page" />
        </div>
    </main>
</template>