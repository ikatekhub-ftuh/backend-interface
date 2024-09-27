<!--
 TODO:
 TODO:
 TODO:
 TODO:
    1. CHANGE THIS CODE to work with berita, make the pagination works (use server side pagination)
    2. PAGINATION ALMOST WORK!!!
    3. fix search
  -->

<template>
    <main class="space-y-2">
        <Toolbar class="mb-6">
            <template #start>
                <Button label="Tambah" icon="pi pi-plus" class="mr-2"
                    @click="$router.push({ 'name': 'input berita' })" />
                <Button :label="state._select ? 'Hapus' : 'Pilih Item'"
                    :icon="state._select ? 'pi pi-trash' : 'pi pi-check-square'" severity="danger"
                    :outlined="!state._select" @click="state._select = !state._select" />
                <Button v-if="state._select" label="Batal" icon="pi pi-times" class="ml-2"
                    @click="state._select = !state._select" />
            </template>
            <template #end>
                <IconField class="mr-2">
                    <InputIcon>
                        <i class="pi pi-search" />
                    </InputIcon>
                    <InputText v-model="filters.search" placeholder="Keyword Search" />
                </IconField>
            </template>
        </Toolbar>
        <DataTable ref="dt" :value="fetchdata.items.data" removableSort :rows="10" v-model:selection="items.selection"
            :loading="state._fetchloading">
            <Column v-if="state._select" selectionMode="multiple" headerStyle="width: 3rem"></Column>
            <Column field="judul" header="Judul">
                <template #body="slotProps">
                    <div class="w-[200px]">
                        {{ slotProps.data.judul }}
                    </div>
                </template>
            </Column>
            <Column v-for="col of columns" :sortable="col.sortable" :key="col.field" :field="col.field"
                :header="col.header">
            </Column>
            <Column header="Action" class="flex gap-2">
                <template #body>
                    <Button icon="pi pi-eye" class=" p-button-outlined" />
                    <Button icon="pi pi-pencil" class=" p-button-outlined" severity="warn" />
                    <Button icon="pi pi-trash" class=" p-button-outlined" severity="danger" />
                </template>
            </Column>
            <Column v-for="col of hiddenColumns" :key="col.field" :field="col.field" :header="col.header"
                class="hidden">
            </Column>
            <template #footer>
                <Paginator @page="handlePageChange" :rows="state.pagination._rows" :totalRecords="fetchdata.items.total"
                    :rowsPerPageOptions="[10, 15, 25, 50]" @update:rows="handleRowsChange" />
            </template>
            <template #empty>
                <sub-emptytable />
            </template>
        </DataTable>
    </main>
</template>

<script>
export default {
    name: 'beritaInput',
    data() {
        return {
            v$: useVuelidate(),
            clear: {},
            items: {
                selection: []
            },
            columns: [
                { field: 'penulis', header: 'Penulis' },
                { field: 'total_like', header: 'Total Like' },
                { field: 'id_kategori_berita', header: 'Kategori' },
            ],
            hiddenColumns: [
                { field: 'konten', header: 'Konten' },
                { field: 'deskripsi', header: 'Deskripsi' },
            ],
            filters: {
                search: '',
            },
            fetchdata: {
                items: []
            },
            state: {
                _fetchloading: true,
                _select: false,
                pagination: {
                    _rows: 10,
                }
            }
        }
    },
    validations() {
        return {
        }
    },
    methods: {
        handlePageChange(page) {
            this.initialfetch(page.page + 1);
        },
        handleRowsChange(rows) {
            this.state.pagination._rows = rows;
        },
        async initialfetch(page = 1, search = this.filters.search, rows = this.state.pagination._rows) {
            this.state._fetchloading = true;
            try {
                const { data } = await axios.get('berita' + `?page=${page}` + `&limit=${rows}` + `&search=${search}`);
                this.fetchdata.items = data.data
            } catch (error) {
                uptoast(this.$toast, 'error', 'Gagal mengambil data');
            } finally {
                this.state._fetchloading = false;
            }
        },
    },
    async mounted() {
        this.clear = { ...this.items };
        await this.initialfetch();
    },
    watch: {
        // debouncing search
        'filters.search': {
            handler: function (val) {
                clearTimeout(this.searchTimeout);
                this.searchTimeout = setTimeout(() => {
                    this.initialfetch(1);
                }, 500);
            },
            deep: true,
        },
    }
};
</script>
<style scoped></style>
