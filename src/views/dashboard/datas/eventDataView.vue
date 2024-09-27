<!--
 TODO:
 TODO:
 TODO:
 TODO:
    1. Add to snippet router push
    2. Make the delete functional
  -->

<template>
    <main class="space-y-2">
        <Toolbar class="mb-6">
            <template #start>
                <!-- add to snippet router push -->
                <Button label="Tambah" icon="pi pi-plus" class="mr-2"
                    @click="$router.push({ 'name': 'input event' })" />
                <Button :label="state._select ? 'Hapus' : 'Pilih Item'"
                    :icon="state._select ? 'pi pi-trash' : 'pi pi-check-square'" severity="danger"
                    :outlined="!state._select" @click="toggleSelect(false, $event)" />
                <Button v-if="state._select" label="Batal" icon="pi pi-times" class="ml-2"
                    @click="toggleSelect(true)" />
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
        <DataTable ref="dt" :value="fetchdata.loker" removableSort v-model:filters="filters.filter" paginator :rows="10"
            v-model:selection="items.selection" :rowsPerPageOptions="[5, 10, 15]"
            :globalFilterFields="['nama_perusahaan']" :loading="state._fetchloading">
            <Column v-if="state._select" selectionMode="multiple" headerStyle="width: 3rem"></Column>
            <Column v-for="col of columns" :sortable="col.sortable" :key="col.field" :field="col.field"
                :header="col.header">
            </Column>
            <Column header="Action" class="flex gap-2">
                <template #body="slotProps">
                    <Button icon="pi pi-eye" class=" p-button-outlined" />
                    <Button icon="pi pi-pencil" class=" p-button-outlined" severity="warn" />
                    <Button icon="pi pi-trash" class=" p-button-outlined" severity="danger"
                        @click="deleteData(slotProps.data.id_event, $event)" />
                </template>
            </Column>
            <template #empty>
                <sub-emptytable />
            </template>
        </DataTable>
    </main>
</template>

<script>
import { FilterMatchMode } from '@primevue/core/api'

export default {
    data() {
        return {
            v$: useVuelidate(),
            appdata,
            clear: {},
            items: {
                selection: []
            },
            columns: [
                { sortable: true, field: 'judul', header: 'Judul' },
            ],
            filters: {
                filter: {
                    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
                }
            },
            fetchdata: {
                loker: []
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
        toggleSelect(reset, event) {
            if (reset) {
                uptoast(this.$toast, 'info', 'Pemilihan item dibatalkan');
                this.items.selection = [];
                this.state._select = false;
                return
            }

            if (this.items.selection.length > 0) {
                const ids = this.items.selection.map((item) => item.id_event);
                this.deleteData(ids, event);
            } else {
                this.state._select = !this.state._select;
            }
        },
        deleteData(ids, event) {
            ids = Array.isArray(ids) ? ids : [ids];
            const accept = () => {
                event.target.disabled = true;
                axios.delete('event', { data: { id_event: ids } })
                    .then(() => {
                        uptoast(this.$toast, 'success', 'Berhasil menghapus data');
                        this.initialfetch();
                    })
                    .catch(() => {
                        uptoast(this.$toast, 'error', 'Gagal menghapus data');
                    })
                    .finally(() => {
                        event.target.disabled = false;
                        this.items.selection = [];
                        this.state._select = false;
                    });
            }
            const reject = () => {
                uptoast(this.$toast, 'info', 'Batal menghapus data');
            }
            upconfirm(this.$confirm, event, accept, reject);
        },
        async initialfetch() {
            this.state._fetchloading = true;
            try {
                const { data } = await axios.get('event');
                console.log(data);
                this.fetchdata.loker = data.data.data
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
