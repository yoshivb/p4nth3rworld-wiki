<script setup lang="ts">
const nuxtApp = useNuxtApp();
const config = useRuntimeConfig();
const route = useRoute()
const routePath = "/posts/" + (typeof route.params.slug === "string" ? route.params.slug : route.params.slug.join("/"));
const { data: page } = await useAsyncData(`docs-${routePath}`, () => queryContent(routePath).findOne());

if (!page.value) { 
    throw createError({ statusCode: 404, statusMessage: 'Page not found' });
}

useContentHead({
    head: {
        titleTemplate: () => `${page.value?.title} | p4nth3rworld Wiki`,
    },
    body: page.value?.body,
    _id: page.value?._id
});

</script>

<template>
    <main>
        <div v-if="page" class="w-full flex flex-row justify-between px-2">
            <h1 class="text-balance font-extrabold text-4xl">{{ page.title }} - History</h1>
            <UButton to="./" external>
                <p>Return to Page</p>
            </UButton>
        </div>
        <div v-if="page" class="prose prose-zinc dark:prose-invert prose-h1:text-balance max-w-none">
            <div v-for="commit of commits">
                <div class="flex justify-between gap-2">
                    <p>{{ commit.commit.message }}</p>
                    <p>{{ commit.commit.author?.name }}</p>
                </div>
            </div>
        </div>
    </main>
</template>