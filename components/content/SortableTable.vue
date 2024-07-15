<script setup lang="ts">
import {useSlots, type VNodeNormalizedChildren} from 'vue'
const slots = useSlots();
const content = computed(() => {
	if(slots.default)
	{
		return slots.default().map(getTextFromVNode)
	}	
	return null;
});

function getTextFromVNode(vnode: any) {
	console.log(vnode);
	if (typeof vnode.children === 'string') {
		return vnode.children;
	} else if (vnode.children?.default) {
		const nodes = vnode.children.default();
		return nodes.map(getTextFromVNode);
	}
}

const mappedContent = computed(() => {
	if(content.value)
	{
		const data = content.value[0];
		const header = data[0].flat(3);
		const rowData = data[1];

		
		const columns = header.map((item: string) => {
		return {
			key: item, 
			label: item,
			sortable: true};
		});
		const rows = rowData.map((entries: string[][]) => {
			let result: any = {};
			for(let i = 0; i < entries.length; i ++)
			{
				let value:string|number = entries[i][0];
				let numberValue = parseInt(value);
				if(!Number.isNaN(numberValue))
				{
					value = numberValue;
				}
				result[header[i]] = value;
			}
			return result;
		});
		return {columns, rows};
	}
	return {}
});
const rows = [{}];
</script>

<template>
	<UTable :rows="mappedContent.rows" :columns="mappedContent.columns" />
</template>