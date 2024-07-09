<script setup lang="ts">
const slots = useSlots();
const content = computed(() => {
  return slots
  .default()
  .map(getTextFromVNode)
});

function getTextFromVNode(vnode: VNode) {
  if (typeof vnode.children === 'string') {
    return vnode.children;
  } else if (vnode.children.default) {
    const nodes = vnode.children.default();
    return nodes.map(getTextFromVNode);
  }
}

const mappedContent = computed(() => {
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
});
const rows = [{}];
</script>

<template>
	<UTable :rows="mappedContent.rows" :columns="mappedContent.columns" />
</template>