<template>
    <div class="flex flex-col gap-5 main">

        <Message severity="info" icon="pi pi-database" v-if="cached" closable>
            <span>
                Menggunakan data cache.
                <span class="link" @click="onStart(true)">Klik untuk refresh</span>
            </span>
        </Message>
        <Message severity="info" icon="pi pi-clock" v-if="cached" closable>
            <span>
                Terakhir diambil pada {{ getLastFetchTime() }}
            </span>
        </Message>
        <DataTable removableSort v-model:filters="filters" ref="dt" v-model:selection="selectedProduct" :value="news"
            paginator :rows="10" :rowsPerPageOptions="[5, 10, 15]" :size="size.value" dataKey="id_berita"
            :globalFilterFields="['judul', 'penulis', 'kategori.kategori', 'id_berita']">
            <!-- paginator  -->
            <template #header>
                <div class="flex justify-between">
                    <SelectButton v-model="size" size="small" :options="sizeOptions" optionLabel="label"
                        dataKey="label" />
                    <div class="flex flex-row gap-1 justify-center items-center">
                        <Button v-if="!selectionMode" :size="size.value" class="h-full" text @click="toggleSelection()"
                            severity="secondary">
                            <span class="pi pi-trash"></span>
                        </Button>
                        <!-- delete or cancel -->
                        <div v-else>
                            <Button :size="size.value" icon="pi pi-trash" label="Hapus" class="h-full" text
                                @click="toggleSelection('commit', $event)" severity="danger" />
                            <Button :size="size.value" icon="pi pi-times" label="Cancel" class="h-full" text
                                @click="toggleSelection('cancel')" severity="secondary" />
                        </div>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                        </IconField>
                    </div>
                </div>
            </template>
            <Column v-if="selectionMode" selectionMode="multiple" headerStyle="width: 3rem"></Column>
            <Column field="id_berita" sortable header="ID"></Column>
            <Column field="judul" sortable header="Judul"></Column>
            <Column field="penulis" sortable header="Penulis"></Column>
            <Column field="total_like" sortable header="Like">
                <template #body="slotProps">
                    <span class="pi pi-thumbs-up mr-2"></span>
                    <span class="text-ellipsis text-nowrap"> {{ slotProps.data.total_like }} </span>
                </template>
            </Column>
            <Column field="kategori.kategori" sortable header="Kategori">
                <template #body="slotProps">
                    <span class="category text-ellipsis text-nowrap"> {{ slotProps.data.kategori.kategori }} </span>
                </template>
            </Column>
            <Column sortable header="Action">
                <template #body="slotProps">
                    <div class="flex flex-row gap-1">
                        <Button :size="size.value" @click="onDelete(slotProps.data.id_berita, $event)"
                            severity="danger">
                            <span class="pi pi-trash"></span>
                        </Button>
                        <Button :size="size.value" @click="openModal('view', slotProps.data.id_berita)" severity="info">
                            <span class="pi pi-eye"></span>
                        </Button>
                        <Button :size="size.value" @click="openModal('edit', slotProps.data.id_berita)" severity="warn">
                            <span class="pi pi-pencil"></span>
                        </Button>
                    </div>
                </template>
            </Column>
            <!-- hidden Column for exporting purpose -->
            <Column field="deskripsi" header="Deskripsi" class="hidden"></Column>
            <Column field="konten" header="Konten" class="hidden"></Column>
            <Column field="gambar" header="Gambar" class="hidden"></Column>
            <Column field="created_at" header="Created At" class="hidden"></Column>
            <template #paginatorstart>
                <Button type="button" icon="pi pi-refresh" text @click="onStart(true)" />
            </template>
            <template #paginatorend>
                <Button icon="pi pi-external-link" label="Export" text @click="exportCSV()" />
            </template>
        </DataTable>
    </div>

    <Dialog v-if="modalData.news" v-model:visible="modal.viewVisible" modal maximizable dismissableMask
        :header="modalData.header" @hide="() => { modalData = { newData: null } }" :style="{ width: '50vw' }"
        :breakpoints="{ '1199px': '80vw', '575px': '100vw' }">
        <div class="fluid *:mb-1">

            <Message severity="info" icon="pi pi-database" v-if="modalData.usingCache" closable>
                <span>
                    Menggunakan data cache. <span class="link" @click="onStart(true, 'view')">Klik untuk refresh</span>
                </span>
            </Message>

            <div class="flex justify-center items-center bg-slate-100 !mb-2">
                <Image :src="this.default.image + modalData.news.gambar" :alt="`image of ${modalData.news.judul}`"
                    class="w-full lg:max-w-[50vw] md:max-w-[70vw] sm:max-w-[80vw]" preview>
                    <template #image>
                        <img :src="this.default.image + modalData.news.gambar" @error="hideMySelf"
                            class="h-auto w-full aspect-video lg:max-w-[50vw] md:max-w-[70vw] sm:max-w-[80vw]" />
                    </template>
                </Image>
            </div>
            <div>
                <Tag :value="modalData.news.kategori.kategori" severity="info" />
            </div>
            <div>
                <h2 class="font-semibold text-2xl">{{ modalData.news.judul }}</h2>
            </div>
            <div>
                <span class="font-medium">By {{ modalData.news.penulis }}</span>
            </div>
            <div class="font-semibold">
                <span class="pi pi-thumbs-up mr-2 "></span>{{ modalData.news.total_like }} Likes
            </div>
            <div class="font-semibold">
                <span class="pi pi-calendar mr-2 "></span>{{ formattedDate(modalData.news.created_at) }}
            </div>
            <div class=" max-w-max overflow-y-scroll max-h-[400px]">{{ modalData.news.deskripsi }}</div>
            <Panel header="Konten" toggleable>
                <div class="prose w-full max-w-full overflow-y-scroll max-h-[700px]" v-html="modalData.news.konten">
                </div>
            </Panel>
        </div>
    </Dialog>

    <Dialog v-if="modalData.news" v-model:visible="modal.editVisible" modal maximizable dismissableMask
        :header="modalData.header" @hide="() => { modalData = { newData: null } }" :style="{ width: '50vw' }"
        :breakpoints="{ '1199px': '80vw', '575px': '100vw' }">
        <div class="fluid *:mb-2">
            <Message severity="info" icon="pi pi-database" v-if="modalData.usingCache" closable>
                <span>
                    Menggunakan data cache. <span class="link" @click="onStart(true, 'view')">Klik untuk refresh</span>
                </span>
            </Message>
            <div class="flex justify-center items-center bg-slate-100 !mb-2">
                <Image :src="this.default.image + modalData.news.gambar" :alt="`image of ${modalData.news.judul}`"
                    class="w-full lg:max-w-[50vw] md:max-w-[70vw] sm:max-w-[80vw]" preview>
                    <template #image>
                        <img :src="this.default.image + modalData.news.gambar" @error="hideMySelf"
                            class="h-auto w-full aspect-video lg:max-w-[50vw] md:max-w-[70vw] sm:max-w-[80vw]" />
                    </template>
                </Image>
            </div>
            <div class="max-w-[400px]">
                <p class="font-semibold text-lg">Kategori</p>
                <Select v-model="modalData.news.kategori" :options="cats" filter optionLabel="kategori"
                    placeholder="Kategori" class="!w-full md:w-56">
                    <template #value="slotProps">
                        <div v-if="slotProps.value.kategori" class="flex items-center">
                            <div>{{ slotProps.value.kategori }}</div>
                        </div>
                        <span v-else>
                            {{ slotProps.placeholder }}
                        </span>
                    </template>
                    <template #option="slotProps">
                        <div class="flex justify-between gap-2">{{ slotProps.option.kategori }}</div>
                    </template>
                </Select>
            </div>
            <div class="max-w-[400px]">
                <p class="font-semibold text-lg">Judul</p>
                <InputText fluid v-model="modalData.news.judul" placeholder="Judul Berita"
                    v-tooltip.bottom="{ value: 'Masukkan judul berita anda di sini', showDelay: 1000, hideDelay: 300 }" />
            </div>
            <div class="max-w-[400px]">
                <p class="font-semibold text-lg">Penulis</p>
                <InputText fluid v-model="modalData.news.penulis" placeholder="Penulis Berita"
                    v-tooltip.bottom="{ value: 'Masukkan nama penulis berita anda di sini', showDelay: 1000, hideDelay: 300 }" />
            </div>
            <div class="max-w-[400px] overflow-y-scroll max-h-[400px]">
                <p class="font-semibold text-lg">Deskripsi</p>
                <Textarea class="w-full" v-model="modalData.news.deskripsi" rows="5" cols="30"
                    placeholder="Deskripsi berita"
                    v-tooltip.bottom="{ value: 'Masukkan deskripsi berita anda di sini', showDelay: 1000, hideDelay: 300 }" />
            </div>
            <div>
                <p class="font-semibold text-lg">Artikel</p>
                <div>
                    <Editor v-model="modalData.news.konten">
                    </Editor>
                </div>
            </div>
            <div class="flex items-center gap-2 ">
                <sub-yesnocomp :off="computedVerification" :submitloading="buttonState.submit_loading" @yes="onSubmit()"
                    @no="onClear()" />
            </div>
        </div>
    </Dialog>
</template>

<script>
import { FilterMatchMode } from '@primevue/core/api';

import Editor from 'primevue/editor';
// patch for quill editor to fix rendering issue
Editor.methods.renderValue = function renderValue(value) {
    if (this.quill) {
        if (value) {
            const delta = this.quill.clipboard.convert({ html: value });
            this.quill.setContents(delta, 'silent');
        } else {
            this.quill.setText('');
        }
    }
};

export default {
    inject: ['default'],
    data() {
        const KEY = 'news';
        const stateObject = useIDBKeyval(`${KEY}-object`, {
            data: [],
        });

        const localState = ref(stateObject);

        watch(localState, (newValue) => {
            stateObject.value = newValue;
        }, { deep: true });

        return {
            key: KEY,
            localState,
            selectionMode: false,
            news: [
            ],
            size: { label: 'Normal', value: 'null' },
            sizeOptions: [
                { label: 'Small', value: 'small' },
                { label: 'Normal', value: 'null' },
                { label: 'Large', value: 'large' }
            ],
            filters: {
                global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            },
            selectedProduct: null,
            cacheDuration: 1800000,
            cached: false,
            modal: {
                viewVisible: false,
                editVisible: false,
                exportVisible: false,
            },
            modalData: {
                newData: null,
            },
            cats: [],
            buttonState: {
                submit_loading: false,
            },
            exportType: null,
            exportOptions: [
                { label: 'CSV', value: 'csv' },
                { label: 'Excel', value: 'excel' },
            ],
        };
    },
    computed: {
        formattedDate() {
            return (dateString) => {
                const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
                return new Date(dateString).toLocaleDateString('id-ID', options);
            };
        },
        computedVerification() {
            return Object.values(this.modalData.news).some((val) => val === null || val === undefined || val === '' || val.length === 0);
        },
    },
    methods: {
        onDelete(id, event) {
            this.$confirm.require({
                target: event.currentTarget,
                icon: 'pi pi-exclamation-triangle',
                acceptProps: { label: 'Ya', severity: 'success' },
                rejectProps: { label: 'Tidak', severity: 'warning' },
                group: window.innerWidth < 1024 ? 'dialog' : 'popup',
                header: 'Konfirmasi Penghapusan',
                message: 'Data yang dihapus tidak bisa dipulihkan',
                accept: () => {
                    axios.delete(`berita?id_berita=${id}`).then((res) => {
                        this.onStart(true);
                        this.$toast.add({
                            severity: 'success', summary: 'Success',
                            detail: 'Data berhasil dihapus', life: 3000,
                        });
                    }).catch((err) => {
                        // error becuase of onDelete restrict from backend
                        this.$toast.add({
                            severity: 'error', summary: 'Error',
                            detail: 'Data gagal dihapus', life: 3000,
                        });
                        console.log(err);
                    });
                },
                reject: () => {
                    this.$toast.add({
                        severity: 'info', summary: 'Info',
                        detail: 'Data tidak dihapus', life: 3000,
                    });
                },
            });
        },
        async exportCSV() {
            this.$refs.dt.exportCSV();
        },
        async loadIndexedDB(timeout = 5000) {
            return new Promise((resolve, reject) => {
                const checkIndexedDB = setInterval(() => {
                    if (this.localState.data) {
                        clearInterval(checkIndexedDB);
                        resolve();
                    }
                }, 100);

                setTimeout(() => {
                    clearInterval(checkIndexedDB);
                    reject(new Error('IndexedDB load timeout'));
                }, timeout);
            });
        },
        hideMySelf(event) {
            event.target.style.display = 'none';
        },
        async onStart(force = false, from = null) {
            if (from) {
                this.modalData = { newData: null };
                switch (from) {
                    case 'view':
                        this.modal.viewVisible = false;
                        break;
                    case 'edit':
                        this.modal.editVisible = false;
                        break;
                    default:
                        break;
                }
            }

            const now = new Date().getTime();

            const lastFetches = JSON.parse(localStorage.getItem('lastFetches')) || {};
            const cachednews = JSON.stringify(this.localState.data.data);

            if (lastFetches.news && cachednews && (now - lastFetches.news < this.cacheDuration) && !force) {
                this.news = JSON.parse(cachednews);
                this.cached = true;
                return;
            }

            axios.get('http://127.0.0.1:8000/api/berita?all').then((res) => {
                this.news = res.data.data.data
                lastFetches.news = now;
                localStorage.setItem('lastFetches', JSON.stringify(lastFetches));
                this.localState.data.data = this.news;

                this.cached = false;
                this.$toast.add({ severity: 'success', summary: 'Success', detail: 'Data fetched successfully', life: 3000 });
            }).catch((err) => {
                console.log(err);
                this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch data', life: 3000 });
            })
        },
        openModal(context, id, event) {
            if (id) {
                const news = this.localState.data.data.find((item) => item.id_berita === id);
                const { cloned, sync } = useCloned(news)
                this.modalData.news = cloned;
                if (this.cached) {
                    this.modalData.usingCache = true;
                }
            }

            switch (context) {
                case 'view':
                    this.modalData.header = 'View News';
                    this.modal.viewVisible = true;
                    break;
                case 'edit':
                    this.modalData.header = 'Edit News';
                    this.modal.editVisible = true;
                    axios.get('berita/kategori').then((res) => {
                        this.cats = res.data.data;
                    }).catch((err) => {
                        console.log(err);
                    });
                    break;
                default:
                    break;
            }
        },
        toggleSelection(arg, event) {
            switch (arg) {
                case 'cancel':
                    this.selectionMode = false;
                    this.selectedProduct = null;
                    this.$toast.add({ severity: 'info', summary: 'Info', detail: 'Tidak ada item yang dihapus', life: 3000 });
                    break;
                case 'commit':
                    this.$confirm.require({
                        target: event.currentTarget,
                        icon: 'pi pi-exclamation-triangle',
                        acceptProps: { label: 'Ya', severity: 'success' },
                        rejectProps: { label: 'Tidak', severity: 'warning' },
                        group: window.innerWidth < 1024 ? 'dialog' : 'popup',
                        header: 'Konfirmasi Penghapusan',
                        message: 'Data yang dihapus tidak bisa dipulihkan',
                        accept: () => {
                            if (this.selectedProduct) {
                                this.$toast.add({ severity: 'success', summary: 'Success', detail: 'Data berhasil dihapus', life: 3000 });
                            } else {
                                this.$toast.add({ severity: 'info', summary: 'Info', detail: 'Tidak ada item yang dihapus', life: 3000 });
                            }
                        },
                        reject: () => {
                            this.$toast.add({ severity: 'info', summary: 'Info', detail: 'Data tidak dihapus', life: 3000 });
                        },
                    });
                    break;
                default:
                    this.selectionMode = !this.selectionMode;
                    this.selectedProduct = null;
                    break;
            }
        },
        getLastFetchTime() {
            const lastFetches = JSON.parse(localStorage.getItem('lastFetches')) || {};
            if (lastFetches.news) {
                const date = new Date(parseInt(lastFetches.news))
                    .toLocaleString('id-ID');
                const diff = new Date().getTime() - lastFetches.news;

                if (diff < 60000) {
                    return `${date} (${Math.floor(diff / 1000)} detik yang lalu)`;
                } else if (diff < 3600000) {
                    return `${date} (${Math.floor(diff / 60000)} menit yang lalu)`;
                } else if (diff < 86400000) {
                    return `${date} (${Math.floor(diff / 3600000)} jam yang lalu)`;
                } else {
                    return `${date} (${Math.floor(diff / 86400000)} hari yang lalu)`;
                }
            } else {
                return 'Never';
            }
        },
        onSubmit() {
            this.buttonState.submit_loading = true;
            const fd = new FormData();
            if (this.modalData.newData) {
                console.log('gambar ada');
                console.log(this.modalData.newData.gambar);
                fd.append('gambar', this.modalData.newData.gambar);
            }
            fd.append('id_berita', this.modalData.news.id_berita);
            fd.append('id_kategori_berita', this.modalData.news.kategori.id_kategori_berita);
            fd.append('judul', this.modalData.news.judul);
            if (this.modalData.news.konten !== this.localState.data.data.find((item) => item.id_berita === this.modalData.news.id_berita).konten) {
                fd.append('konten', this.modalData.news.konten);
                console.log('kontent tidak sama');
            } else {
                console.log('kontent sama');
            }

            fd.append('deskripsi', this.modalData.news.deskripsi);
            fd.append('penulis', this.modalData.news.penulis);

            axios.post('berita/edit', fd)
                .then((res) => {
                    this.onStart(true);
                    this.modal.editVisible = false;
                    this.$toast.add({ severity: 'success', summary: 'Terupload', detail: 'Data berita anda berhasil diupload', life: 3000 });
                    this.buttonState.submit_loading = false;
                })
                .catch((err) => {
                    this.$toast.add({ severity: 'error', summary: 'Gagal', detail: 'Data berita anda gagal diupload', life: 3000 });
                    this.buttonState.submit_loading = false;
                })
        },
    },
    async mounted() {
        await this.loadIndexedDB();
        this.onStart();
    },

};
</script>

<style scoped>
.category {
    padding: 0.2rem 0.5rem;
    border-radius: 0.5rem;
    background-color: #e8eaf7;
    color: #333;
    font-size: 0.8rem;
    font-weight: 500;
    text-transform: capitalize;
    display: inline-block;
    cursor: default;
}
</style>
