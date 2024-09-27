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
        <DataTable ref="dt" :value="fetchdata.loker" removableSort v-model:filters="filters.filter" paginator :rows="10"
            v-model:selection="items.selection" :rowsPerPageOptions="[5, 10, 15]"
            :globalFilterFields="['judul', 'perusahaan.nama_perusahaan', 'lokasi', 'role']"
            :loading="state._fetchloading">
            <Column v-if="state._select" selectionMode="multiple" headerStyle="width: 3rem"></Column>
            <Column sortable field="judul" header="Judul">
                <template #body="slotProps">
                    <div class="w-[200px]">
                        {{ slotProps.data.judul }}
                    </div>
                </template>
            </Column>
            <Column sortable field="pengalaman_kerja" header="Pengalaman">
                <template #body="slotProps">
                    {{ slotProps.data.pengalaman_kerja }} Tahun
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
                // { "id_loker": 1, "judul": "Admin Pengelola Data Alumni ANTEK HUB", "id_perusahaan": 1, "slug": "admin-pengelola-data-alumni-antek-hub", "konten": "Mengelola database alumni untuk memastikan informasi selalu up-to-date.<br>Memastikan validitas dan integritas data yang masuk ke dalam sistem.<br>Mengkoordinasikan kegiatan dan acara terkait alumni dengan departemen terkait.<br>Menghasilkan laporan berkala mengenai status dan statistik alumni.<br>Berkomunikasi dengan alumni melalui berbagai saluran untuk keperluan administrasi.", "deskripsi": "Mengelola database alumni untuk memastikan informasi selalu up-to-date.", "tgl_selesai": "2024-10-01", "lokasi": "Makassar", "pengalaman_kerja": "2", "role": "Purna Waktu", "created_at": "2024-08-31T07:41:55.000000Z", "updated_at": "2024-08-31T07:41:55.000000Z", "perusahaan": { "id_perusahaan": 1, "nama_perusahaan": "FAKULTAS TEKNIK UNHAS", "logo": "gambar/loker/logo-perusahaan.png" } }
                { sortable: true, field: 'tgl_selesai', header: 'Selesai' },
                { field: 'lokasi', header: 'Lokasi' },
                { field: 'role', header: 'Jenis' },
                { field: 'perusahaan.nama_perusahaan', header: 'Perusahaan' }
            ],
            hiddenColumns: [
                { field: 'konten', header: 'Konten' },
                { field: 'deskripsi', header: 'Deskripsi' },
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
                _buttonLoading: false,
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
        async initialfetch() {
            this.state._fetchloading = true;
            try {
                const { data } = await axios.get('loker?limit=-1');
                console.log(data.data.data);
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
