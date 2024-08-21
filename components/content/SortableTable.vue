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
	column_types: {
		type: Object,
		default() {
			return {}
		}
	},
	max_rows: {
		type: Number,
		default: 10
	},
	downloadable: {
		type: Boolean,
		default: false
	}
});

function ArrayToSorted<T>(array: T[], compareFn: (a:T, b:T) => number )
{
	if(Array.prototype.toSorted !== undefined)
	{
		return array.toSorted(compareFn);
	}
	else
	{
		const newArray = [...array];
		return newArray.sort(compareFn);
	}
}

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
			let result: Record<string, string|number|Date> = {};
			for(let i = 0; i < entries.length; i ++)
			{
				let value:string|number|Date = entries[i][0];
				const column_type = props.column_types[header[i]];
				if(column_type === "Date")
				{
					value = new Date(Date.parse(value));
				}
				else if(column_type === "Number")
				{
					value = parseInt(value);
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
		return mappedContent?.rows;
	}

	const result =  mappedContent?.rows.filter((person) => {
		return Object.values(person).some((value) => {
			return getRowValueString(value).toLowerCase().includes(filterInput.value.toLowerCase())
		})
	});
	return result;
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
		const result = ArrayToSorted(filteredRows.value, ((rowA, rowB) => {
			const valueA = rowA[sort.value.column];
			const valueB = rowB[sort.value.column];
			if(typeof valueA === "object" && typeof valueB === "object")
			{
				if(sort.value.direction === "asc")
				{
					return valueA.getTime() - valueB.getTime();
				}
				else
				{
					return valueB.getTime() - valueA.getTime();
				}
			}
			else if(typeof valueA === "number" && typeof valueB === "number")
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
		}));
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
});

// --- Stringify Rows --- //

function getRowValueString(rowValue: string|number|Date)
{
	if(typeof rowValue === "object")
	{
		return `${rowValue.getDate()} ${rowValue.toLocaleString('en-US', {month: 'short'})} ${rowValue.getFullYear()}`;
	}
	else if(typeof rowValue === "number")
	{
		return rowValue.toString();
	}
	return rowValue.toString();
}

const stringRows = computed(() => {
	if(paginatedRows.value)
	{
		return paginatedRows.value.map((row) => {
			const stringRow = Object.assign({}, row);
			for(let column in props.column_types)
			{
				stringRow[column] = getRowValueString(stringRow[column]);
			}
			return stringRow;
		})
	}
});

// --- Download Content --- //

const csvFile = computed(() => {
	const columns = mappedContent.columns?.map((columnEntry: any) => {
		return `"${columnEntry.label}"`;
	}).join(',');
	const rows = mappedContent.rows?.map((rowEntry) => {
		return Object.values(rowEntry).map((item) => {
			if(item instanceof Date)
			{
				return `"${item.toISOString()}"`;
			}
			return `"${item.toString()}"`;
		}).join(",");
	}).join('\n');

	return `${columns}\n${rows}`;
});

async function DownloadContent()
{
	const suggestedName = 'data.csv';

	const supportsFileSystemAccess =
	'showSaveFilePicker' in window &&
	(() => {
		try {
		return window.self === window.top;
		} catch {
		return false;
		}
	})();
	// If the File System Access API is supported…
	if (supportsFileSystemAccess) {
		try {
			if(csvFile.value)
			{
				// create a new handle
				// @ts-ignore
				const newHandle = await window.showSaveFilePicker({ 
					suggestedName,
					types: [
						{
							description: "Comma Seperated Values File",
							accept: { "text/plain": [".csv"] },
						},
					] 
				});

				// create a FileSystemWritableFileStream to write to
				const writableStream = await newHandle.createWritable();

				// write our file
				await writableStream.write(csvFile.value);

				// close the file and write the contents to disk.
				await writableStream.close();
			}
		} catch (err) {
			console.error(err);
		}
	}
	else
	{
		// Fallback if the File System Access API is not supported…
		// Create the blob URL.
		const blobURL = URL.createObjectURL(new Blob([csvFile.value], {
			type: 'text/plain'
		}))
		// Create the `<a download>` element and append it invisibly.
		const a = document.createElement('a');
		a.href = blobURL;
		a.download = suggestedName;
		a.style.display = 'none';
		document.body.append(a);
		// Programmatically click the element.
		a.click();
		// Revoke the blob URL and remove the element.
		setTimeout(() => {
			URL.revokeObjectURL(blobURL);
			a.remove();
		}, 1000);
	}
}

</script>

<template>
	<div class="flex justify-end px-3 gap-2 py-3.5 border-b border-gray-200 dark:border-gray-700">
      <UInput v-model="filterInput" placeholder="Filter..." />
	  <UButton v-if="downloadable" @click="DownloadContent">
		<Icon name="icon-park-outline:download"/>
	  </UButton>
    </div>
	<UTable :ui="{ base: 'mt-0', td: {padding: 'px-2'}, th: {padding: 'px-2'} }" v-model:sort="sort" :rows="stringRows" :columns="mappedContent.columns" sort-mode="manual"  />
	<UPagination v-if="maxRows > 0 && (mappedContent?.rows?.length ?? 0) > maxRows"
    v-model="page"
    :ui="{ base: 'ml-auto mt-2' }"
    :total="filteredRows.length"
    :page-count="maxRows"
  />
</template>