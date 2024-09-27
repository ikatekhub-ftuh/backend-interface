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
                    @click="$router.push({ 'name': 'input loker' })" />
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
                    <InputText v-model="filters.filter['global'].value" placeholder="Keyword Search" />
                </IconField>
                <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportData" />
            </template>
        </Toolbar>
        <DataTable ref="dt" :value="fetchdata.items.data" removableSort :rows="10" v-model:selection="items.selection"
            :loading="state._fetchloading">
            <Column v-if="state._select" selectionMode="multiple" headerStyle="width: 3rem"></Column>
            <Column sortable field="judul" header="Judul">
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
                <Paginator @page="handlePageChange" :rows="1" :totalRecords="fetchdata.items.total" />
            </template>
        </DataTable>
    </main>
</template>

<script>
import { FilterMatchMode } from '@primevue/core/api'

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
                { field: 'penulis', header: 'Penulis', sortable: true },
                { field: 'total_like', header: 'Total Like', sortable: true },
                { field: 'id_kategori_berita', header: 'Kategori', sortable: true },
            ],
            hiddenColumns: [
                { field: 'konten', header: 'Konten', sortable: true },
                { field: 'deskripsi', header: 'Deskripsi', sortable: true },
            ],
            filters: {
                filter: {
                    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
                }
            },
            fetchdata: {
                items: []
            },
            state: {
                _fetchloading: true,
                _select: false
            }
        }
    },
    validations() {
        return {
        }
    },
    methods: {
        exportData() {
            this.$refs.dt.exportCSV();
        },
        handlePageChange(page) {
            this.initialfetch(page);
        },
        async initialfetch(page = 1) {
            this.state._fetchloading = true;
            try {
                // FIXME gabisa nih, cek backendnya coba, keknya bukan page
                const { data } = await axios.get('berita' + `?page=${page}`);
                console.log(data.data);
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
    }
};
</script>
<style scoped></style>
