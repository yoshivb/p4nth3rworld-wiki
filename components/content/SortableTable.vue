<script setup lang="ts">

import {useSlots} from 'vue';
const slots = useSlots();
const props = defineProps({
	default_sort: {
		type: Object,
		default() { 
			return {
				column: "",
				direction: "asc"
			}
		}
	},
	max_rows: {
		type: Number,
		default: 10
	}
});

// --- Converting Data to UTable data --- //
const content = slots.default ? slots.default().map(getTextFromVNode) : null;
function getTextFromVNode(vnode: any) {
	if (typeof vnode.children === 'string') {
		return vnode.children;
	} else if (vnode.children?.default) {
		const nodes = vnode.children.default();
		return nodes.map(getTextFromVNode);
	}
}

function mapContent() {
	if(content)
	{
		const data = content[0];
		const header = data[0].flat(3);
		const rowData = data[1] as string[][][];

		
		const columns = header.map((item: string) => {
		return {
			key: item, 
			label: item,
			sortable: true};
		});
		const rows = rowData.map((entries) => {
			let result: Record<string, string|number> = {};
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
	return {columns: null, rows: null}
};

const mappedContent = mapContent();

// --- Filtering --- //

const filterInput = ref('');

const filteredRows = computed(() => {
	if (!mappedContent?.rows)
	{
		return [];
	}

	if (!filterInput.value) {
		return mappedContent?.rows
	}

	return mappedContent?.rows.filter((person) => {
		return Object.values(person).some((value) => {
			return String(value).toLowerCase().includes(filterInput.value.toLowerCase())
		})
	})
});

// --- Sorting --- //

const sort = ref<{ column: string; direction: "asc" | "desc" }>({
	column: mappedContent?.columns[0].key as string ?? "",
	direction: "asc"
});

if(props.default_sort.column)
{
	sort.value.column = props.default_sort.column;
}
if(props.default_sort.direction)
{
	sort.value.direction = props.default_sort.direction;
}

const sortedRows = computed(()=> {
	if(filteredRows.value && sort.value)
	{
		const result = filteredRows.value.toSorted((rowA, rowB) => {
			const valueA = rowA[sort.value.column];
			const valueB = rowB[sort.value.column];
			if(typeof valueA === "number" && typeof valueB === "number")
			{
				if(sort.value.direction === "asc")
				{
					return valueA - valueB;
				}
				else
				{
					return valueB - valueA;
				}
			}
			else
			{
				if(sort.value.direction === "asc")
				{
					return valueA.toString().localeCompare(valueB.toString());
				}
				else
				{
					return valueB.toString().localeCompare(valueA.toString());
				}
			}
		});
		return result;
	}
	return [];
})

// --- Pagination --- //
const page = ref(1);
const maxRows = ref(props.max_rows);

const paginatedRows = computed(()=>{
	if(sortedRows.value)
	{
		if(maxRows.value > 0 && sortedRows.value.length > maxRows.value)
		{
			return sortedRows.value.slice((page.value - 1) * maxRows.value, (page.value) * maxRows.value);
		}
		else
		{
			return sortedRows.value;
		}
	}
	return [];
})

</script>

<template>
	<div class="flex justify-end px-3 py-3.5 border-b border-gray-200 dark:border-gray-700">
      <UInput v-model="filterInput" placeholder="Filter..." />
    </div>
	<UTable :ui="{ base: 'mt-0', td: {padding: 'px-2'}, th: {padding: 'px-2'} }" v-model:sort="sort" :rows="paginatedRows" :columns="mappedContent.columns" sort-mode="manual"  />
	<UPagination v-if="maxRows > 0 && (mappedContent?.rows?.length ?? 0) > maxRows"
    v-model="page"
    :ui="{ base: 'ml-auto mt-2' }"
    :total="filteredRows.length"
    :page-count="maxRows"
  />
</template>