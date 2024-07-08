<script setup lang="ts">
definePageMeta({
  layout: 'docs'
})
const route = useRoute()
const { data: page } = await useAsyncData(`docs-${route.path}`, () => queryContent(route.path).findOne())

if (!page.value) { 
    throw createError({ statusCode: 404, statusMessage: 'Page not found' }) 
}

</script>

<template>
    <main class="prose prose-zinc dark:prose-invert prose-h1:text-balance max-w-none">
        <ContentRenderer v-if="page.body" :value="page" />
    </main>
</template>