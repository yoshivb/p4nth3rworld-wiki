<template>
	<aside class="float-right border-2 m-2 border-slate-700 not-prose">
		<div class="bg-slate-700 font-semibold text-2xl p-2 mb-2">
			<slot name="title" />
		</div>
		<div class="m-2">
			<slot name="image" />
		</div>
		<div class="m-2 grid grid-cols-2 gap-3">
			<slot name="info" />
		</div>
	</aside>
</template>