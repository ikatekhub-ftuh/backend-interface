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
                    @click="$router.push({ 'name': 'input perusahaan' })" />
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
            <Column field="logo" header="Logo" headerStyle="width: 120px">
                <template #body="slotProps">
                    <Image :src="appdata.storageLink + slotProps.data.logo" alt=" " width="250" preview
                        class="w-[120px] h-fit max-h-[120px] object-cover" />
                </template>
            </Column>
            <Column v-for="col of columns" :sortable="col.sortable" :key="col.field" :field="col.field"
                :header="col.header">
            </Column>
            <Column header="Action">
                <template #body="slotProps">
                    <div class="flex gap-2">
                        <sub-actiontable :id="slotProps.data.id_perusahaan" @delete="deleteData" />
                    </div>
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
                { sortable: true, field: 'nama_perusahaan', header: 'Nama' },
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
                const ids = this.items.selection.map((item) => item.id_perusahaan);
                this.deleteData(ids, event);
            } else {
                this.state._select = !this.state._select;
            }
        },
        deleteData(ids, event) {
            ids = Array.isArray(ids) ? ids : [ids];
            const accept = () => {
                event.target.disabled = true;
                axios.delete('loker/perusahaan', { data: { id_perusahaan: ids } })
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
                const { data } = await axios.get('loker/perusahaan');
                this.fetchdata.loker = data.data
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
