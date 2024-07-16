<script setup lang="ts">
const route = useRoute()
const { data: page } = await useAsyncData(`docs-${route.path}`, () => queryContent(route.path).findOne());

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


const editUrl = computed(()=> {
    if(page.value)
    {
        return `/admin/#/edit/${page.value._stem}`;
    }
})
</script>

<template>
    <main>
        <div v-if="page && page.title != 'Home'" class="w-full flex flex-row justify-between px-2">
            <h1 class="text-balance font-extrabold text-4xl">{{ page.title }}</h1>
            <UButton :to="editUrl" external>
                <p>Edit</p>
                <Icon name="icon-park-outline:edit"/>
            </UButton>
        </div>
        <div v-if="page" class="prose prose-zinc dark:prose-invert prose-h1:text-balance max-w-none">
            <aside v-if="page.asideInfo" class="float-right border-2 m-2 border-slate-700 not-prose">
                <div class="bg-slate-700 font-semibold text-2xl p-2 mb-2">
                    <h2>{{page.title}}</h2>
                </div>
                <div v-if="page.image" class="m-2">
                    <NuxtImg src="page.image" />
                </div>
                <div class="m-2 grid grid-cols-2 gap-3">
                    <div v-for="item in page.asideInfo" class="grid grid-cols-subgrid col-span-2">
                        <p>{{item.key}}</p>
                        <p>{{item.value}}</p>
                    </div>
                </div>
            </aside>
            <ContentRenderer v-if="page.body" :value="page" />
        </div>
    </main>
</template>