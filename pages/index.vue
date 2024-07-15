<script setup lang="ts">
const route = useRoute()
const { data: page } = await useAsyncData(`docs-home`, () => queryContent("home").findOne());

if (!page.value) { 
    throw createError({ statusCode: 404, statusMessage: 'Page not found' });
}

useContentHead({
    head: {
        titleTemplate: () => `${page.value?.title} | P4nth3rworld Wiki`,
    },
    body: page.value?.body,
    _id: page.value?._id
});

</script>

<template>
    <main>
        <div v-if="page" class="prose prose-zinc dark:prose-invert prose-h1:text-balance max-w-none">
            <ContentRenderer v-if="page.body" :value="page" />
        </div>
    </main>
</template>